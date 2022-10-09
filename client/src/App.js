import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
//Explore more Monday React Components here: https://style.monday.com/
// import AttentionBox from "monday-ui-react-core/dist/AttentionBox.js";
import TextField from "monday-ui-react-core/dist/TextField.js";
import Button from "monday-ui-react-core/dist/Button.js";
import List from "monday-ui-react-core/dist/List";
import ListItem from "monday-ui-react-core/dist/ListItem";
import Divider from "monday-ui-react-core/dist/Divider";
import Dropdown from "monday-ui-react-core/dist/Dropdown";
import AlertBanner from "monday-ui-react-core/dist/AlertBanner";
import AlertBannerText from "monday-ui-react-core/dist/AlertBannerText";

const monday = mondaySdk();

const BACKEND_SERVER = process.env.REACT_APP_API_SERVER;
const API_TOKEN = process.env.REACT_APP_API_API_TOKEN;
const MONDAY_API = "https://api.monday.com/v2";

const myQuery = `query {
  boards (limit:3) {
	  id
      items () {
          id
          name
          
      column_values {
          id
          title
          value
          text
          additional_info   
          }
      }
  }
}`;

const STATUS_OPTIONS = [
  {
    value: "Working on it",
    label: "Working on it",
    tooltipProps: {
      content: "Project work in progress",
    },
  },
  {
    value: "Stuck",
    label: "Stuck",
    tooltipProps: {
      content: "Stuck on project",
    },
  },
  {
    value: "Done",
    label: "Done",
    tooltipProps: {
      content: "Project completed",
    },
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      boardItemList: [],
      itemDetails: null,
      hasError: false,
      column_values: null,
      boardId: null,
      selectStatus: {label: 'Pending', value:'Pending'}
    };
  }

  componentDidMount() {
    this.fetchColumnValues();
    monday.listen("settings", this.getSettings);
  }

  getSettings = (res) => {
    console.log("settings!", res.data);
  };

  fetchColumnValues() {
    fetch(MONDAY_API, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN,
      },
      body: JSON.stringify({
        query: myQuery,
      }),
    })
      .then(async (res) => {
        const d = await res.json();
        const firstBoard = d.data.boards[1];
        this.setState({
          boardItemList: firstBoard.items,
          boardId: firstBoard.id,
        });
      })
      .catch((err) => alert("Something went wrong!"));
  }

  updateMondayBoard(itemDetails) {
    const { boardId } = this.state;
    const update_query =
      `mutation {change_multiple_column_values (board_id: ${boardId}, item_id: ${itemDetails.rowId}, column_values: \"{\\\"name\\\": \\\"${itemDetails.name}\\\", \\\"text2\\\": \\\"${itemDetails.description}\\\", \\\"status\\\": \\\"${itemDetails.status}\\\" }\") {id}}`;

    fetch(MONDAY_API, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN,
      },
      body: JSON.stringify({
        query: update_query,
      }),
    })
      .then(async(res) => {
        return this.saveOrUpdateItem(itemDetails);
      })
      .catch((res) => console.log(JSON.stringify(res, null, 2)));
  }

  saveOrUpdateItem = (payload) => {
    const { rowId, name, status, description } = payload;
    const query = JSON.stringify({
      query: `mutation {
				addOrUpdate(rowId: "${rowId}", name:"${name}", status:"${status}", description: "${description}" ) {
					id
				}
			}
			`,
    });
    fetch(`${BACKEND_SERVER}/graphql`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: query,
    })
      .then(async (res) => {
        alert("Item details updated!");
      })
      .catch((err) => alert("Something went wrong!"));
  };

  handleItemClick(item) {
    const status = item.column_values[1].text;
    const data = {
      rowId: item.id,
      name: item.name,
      status: status,
      description: item.column_values[2].text,
    };
    this.setState({
      ...this.state,
      itemDetails: data,
      column_values: item.column_values,
      selectStatus: {label: status, value: status}
    });

  }

  onNameChange = (name) => {
    this.setState({ itemDetails: { ...this.state.itemDetails, name } });
  };

  onDescChange = (description) => {
    this.setState({ itemDetails: { ...this.state.itemDetails, description } });
  };

  onStatusChange = (item) => {
    this.setState({
      itemDetails: { ...this.state.itemDetails, status: item.value },
      selectStatus: {label: item.value, value: item.value}
    });
  };

  handleFormSubmit = async () => {
    const { itemDetails } = this.state;
    if (!itemDetails.name || !itemDetails.status || !itemDetails.description)
      this.setState({ ...this.state, hasError: true });
    else {
      this.setState({ ...this.state, hasError: false });
      return this.updateMondayBoard(itemDetails);
    }
  };

  handleAlertClose = () => {
    this.setState({ ...this.state, hasError: false });
  };

  render() {
    const { boardItemList, itemDetails, hasError, selectStatus } = this.state;
    return (
      <div className="App" style={{ display: "flex" }}>
        <div>
          <h3>Select an item to update</h3>
          <hr />
          <List>
            {boardItemList.length > 0
              ? boardItemList.map((d) => {
                  return (
                    <ListItem
                      key={d.id}
                      onClick={() => this.handleItemClick(d)}
                      id="list-1"
                    >
                      {d.name}
                    </ListItem>
                  );
                })
              : "No board items"}
          </List>
        </div>
        <Divider direction={Divider.directions.VERTICAL} />
        <div style={{ marginLeft: 50 }}>
          {hasError ? (
            <AlertBanner
              onClose={this.handleAlertClose.bind()}
              backgroundColor={AlertBanner.backgroundColors.NEGATIVE}
            >
              <AlertBannerText text="All fields are required" />
            </AlertBanner>
          ) : (
            ""
          )}

          <form id="myForm" name="project-form">
            <div className="monday-storybook-text-field_column-wrapper">
              <div className="form-item">
                <TextField
                  disabled={itemDetails && itemDetails.rowId ? false : true}
                  value={itemDetails?.name || ""}
                  onChange={this.onNameChange}
                  title="Item Name*"
                  name="name"
                  size={TextField.sizes.MEDIUM}
                  required
                />
              </div>

              <div className="form-item">
                <p>Status*</p>
                <Dropdown
                  disabled={itemDetails && itemDetails.rowId ? false : true}
                  title="Status*"
                  name="status"
                  placeholder="--Select One--"
                  size={Dropdown.size.MEDIUM}
                  options={STATUS_OPTIONS}
                  onChange={this.onStatusChange}
                  value={selectStatus}
                  className="dropdown-stories-styles_spacing"
                  required
                />
              </div>

              <div className="form-item">
                <TextField
                  disabled={itemDetails && itemDetails.rowId ? false : true}
                  title="Description*"
                  name="description"
                  size={TextField.sizes.MEDIUM}
                  onChange={this.onDescChange}
                  value={itemDetails?.description || ""}
                  required
                />
              </div>

              <Button
                disabled={itemDetails && itemDetails.rowId ? false : true}
                onClick={this.handleFormSubmit}
                type={Button.types.BUTTON}
              >
                Update Item
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
