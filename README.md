# Monday APP

Project management module

## Environment Variables

To run this project, add .env file in project root directory and add following variables

```
    DB_URL=mongodb://localhost:27017/monday_db
    PORT=7200

```

## Run Locally

Clone the project

```bash
  git clone https://github.com/thebinod7/monday-api.git
```

Go to the project directory

```bash
  cd project root-directory
```

Install dependencies and run app

```bash
  npm install

  npm start

  API exposed at http://localhost:7200/

  Create tunnel with ngrok command: ngrok http 7200

```

## Documentation

Project demo and solution doc

Demo video:
https://drive.google.com/file/d/1sF8iwb8OX8XF4T5aVOQ3jYd0S3tj64YK/view?usp=sharing

Solution process doc:
https://docs.google.com/document/d/1Vxgz5nij560JlByzwkAu7cgaLJNqKqCdPxRGJKZ24Jc/edit?usp=sharing

## GraphQL Query and Mutations (Optional: playaround if you would like to)

Go to http://localhost:7200/graphql and test APIs

```
    // Create project
    mutation {
        addProject(rowId: "123", name:"projec1", status:"Working on it", description: "test description" ) {
            id
        }
    }

    // Add or update project by rowId
    mutation {
        addOrUpdate(rowId: "101", name:"project 1", status:"Working on it", description: "test description" ) {
            id
        }
    }

    // Get project
    query {
        getProject(id:"633b9c1f923eee9642eae3e9") { name, status, description }
    }

    // Update project
    mutation {
        updateProject(id: "633ba8b7e661a75501cf6322", rowId: "456", name:"updated item", status:"Done", description: "this is test" ) {
            id
        }
    }

    // List projects
    query {
        listProjects{rowId, name,status,description}
    }

```

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB

**ORM:** Mongoose

**API Service:** GraphQL/REST

**Code Formatter:** Prettier
