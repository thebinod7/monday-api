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

## GraphQL Query and Mutations

Go to http://localhost:7200/graphql and test APIs

```
    // Create project
    mutation {
        addProject(name:"projec1", pulseId:"123", status:"Working on it", dueDate: "1664683108", priority:"High" ) {
            id
        }
    }

    // Get project
    query {
        getProject(id:"633b9c1f923eee9642eae3e9") { name, dueDate, status, priority }
    }

    // Update project
    mutation {
        updateProject(id: "633ba8b7e661a75501cf6322", name:"test", status:"Working on it", dueDate: "1664683108", priority:"High" ) {
            id
        }
    }

    // List projects
    query {
        listProjects{name,status,priority,dueDate}
    }

```

## Tech Stack

**Server:** Node, Express

**Database:** MongoDB

**Code Formatter:** Prettier
