# Monday view details

Monday board view details app

## Environment Variables

Go to project-root => clien directory => Add .env => Paste following code

`PORT=8301`

`BROWSER=none`

`TUNNEL_SUBDOMAIN=item-view-10042770`

`REACT_APP_API_SERVER=http://localhost:7200`

`REACT_APP_API_API_TOKEN=YOUR_TOKEN`

## Run Project

Go to project root directory

```bash
  cd client
  npm install
  npm start
  ngrok http 7200
```

Update `REACT_APP_API_SERVER` in .env then build and upload
