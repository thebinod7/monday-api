
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


## Tech Stack

**Server:** Node, Express

**Database:** MongoDB

**Code Formatter:** Prettier 
