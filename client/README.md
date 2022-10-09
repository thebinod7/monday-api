# Monday view details

Monday board view details app

## Environment Variables

Go to project-root => client directory => Add .env => Paste following code

`PORT=8301`

`BROWSER=none`

`TUNNEL_SUBDOMAIN=item-view-10042770`

`REACT_APP_API_SERVER=http://localhost:7200`

`REACT_APP_API_API_TOKEN=YOUR_TOKEN`

## Run and Upload Project Build

Go to project root directory

```bash
  cd client
  npm install
  npm start
  ngrok http 7200 (It will provide https URL)
```

Update `REACT_APP_API_SERVER` inside `.env` file with ngrok(https) URL then build and upload to monday platform
