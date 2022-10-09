import React from "react";

import {Box, Button} from "monday-ui-react-core";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
import "./App.css";

const monday = mondaySdk();
monday.setToken(process.env.REACT_APP_MONDAY_TOKEN);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        status: '',
        description: '',
        itemId: '',
        boardId: ''
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
}

componentDidMount() {
  monday.listen("context", async res => {
      if (res.data.itemId) {
          this.setState({itemId: res.data.itemId, boardId: res.data.boardId});
          const { itemId } = res.data;
          await monday.api(`query { items (ids: ${itemId}) { name column_values { id text title} } }`).then(async res => {
              const item = res.data.items[0];
              const columnValues = item.column_values;
              const name = item.name;
              const status = columnValues.find(columnValue => columnValue.title === "Status" || columnValue.title === "status")?.text ?? '';

              let description = '';
              const descColumn = columnValues.find(columnValue => columnValue.title === "Description" || columnValue.title === "description");
              if (descColumn) description = descColumn.text;
              else await monday.api(`mutation { create_column (board_id: ${this.state.boardId}, title: "Description", column_type: text) { id } }`);
              this.setState({name: name, status: status, description: description});
          });
      }
  });
}

onInputChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
      [name]: value
  });
}

displaSuccessMsg(query){
  monday.api(query).then(() => {
    monday.execute("notice", {
        message: "Item details updated successfully",
        type: "success",
        timeout: 3000
    });
});
}

handleFormSubmit(event) {
  event.preventDefault();
  const {name, status, description, itemId, boardId} = this.state;
  monday.api(`query { boards(ids: ${boardId}) { columns { id title } } }`).then(res => {
          const columns = res.data.boards[0].columns;
          const statusColId = columns.find(column => column.title === "Status" || column.title === "status").id;
          const descColId = columns.find(column => column.title === "Description" || column.title === "description").id;
          const nameColId = columns.find(column => column.title === "Name" || column.title === "name").id;

          const query = `mutation {
            change_multiple_column_values (item_id: ${itemId}, board_id: ${boardId}, column_values: "{\\"${nameColId}\\": \\"${name}\\", \\"${statusColId}\\": \\"${status}\\", \\"${descColId}\\": \\"${description}\\"}") {
              id
            }
          }`;
        this.displaSuccessMsg(query);
      }
  );
}

render() {
  return (
      <div>
          <Box
              border="components-Box-Box-module__border--oFq69"
              rounded="components-Box-Box-module__roundedMedium--x875c"
              margin={Box.margins.XL}
              padding={Box.paddings.XL}
          >
              <form onSubmit={this.handleFormSubmit}>
                  <div className="monday-storybook-text-field_box">
                      <h1>Item Details</h1>
                      <div className="monday-storybook-text-field_box_wrapper">

                          <h6 className="monday-storybook-label_title">Item Name</h6>
                          <input
                              className="monday-select inputField"
                              name="name"
                              type="text"
                              value={this.state.name}
                              onChange={this.onInputChange}
                              required={true}
                          />

                          <h6 className="monday-storybook-label_title">Status</h6>
                          <select value={this.state.status} onChange={this.onInputChange}
                                  required={true} id="item-status" className="monday-select inputField" name="status">
                              <option value="" disabled>--Select Status--</option>
                              <option value="Working on it">Working on it</option>
                              <option value="Stuck">Stuck</option>
                              <option value="Done">Done</option>
                          </select>

                          <h6 className="monday-storybook-label_title">Description</h6>
                          <textarea
                              className="monday-textarea"
                              name="description"
                              value={this.state.description}
                              onChange={this.onInputChange}
                              required={true}
                              rows="4" cols="50"
                          />

                          <hr />

                          <Button type={Button.types.SUBMIT}>
                              Update Item
                          </Button>
                      </div>
                  </div>
              </form>
          </Box>
      </div>
  );
}
}

export default App;
