![main branch status](https://github.com/heusalagroup/planner/actions/workflows/publish.yml/badge.svg?branch=main)
![dev branch status](https://github.com/heusalagroup/planner/actions/workflows/dev.yml/badge.svg?branch=dev)

# Software Project Planner

Software project planner

## Install development environment

### Clone the repository

```
git clone git@github.com:heusalagroup/planner.git
cd planner
```

### Install git submodules

```
git submodule update --init --recursive
```

### Install NPM packages

```
(cd ./api && npm install)
(cd ./frontend && npm install)
(cd ./testing && npm install)
(cd ./mock-kraftwerk && npm install)
```

## Configuring

### Configuring basic things

| Environment Variable | Description                                                         | Default value           |
| -------------------- | ------------------------------------------------------------------- | ----------------------- |
| `BACKEND_LOG_LEVEL`  | The log level of the backend (DEBUG, INFO, WARN, ERROR, ALL, NONE). | `INFO`                  |
| `BACKEND_URL`        | Which host and port to listen for (HTTP connections).               | `http://0.0.0.0:3000`   |
| `PUBLIC_URL`         | Which URL does this service have in the public internet?            | `http://localhost:3000` |

### Microsoft Authentication secrets (required!)

Edit `./api/.env` file and configure following environment variables:

```
MSAL_TENANT_ID="11111111-2222-3333-4444-555555555555"
MSAL_CLIENT_ID="aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
MSAL_CLIENT_SECRET="very-random-secret-string"
```

| Environment Variable | Description                                     |
| -------------------- | ----------------------------------------------- |
| `MSAL_TENANT_ID`     | Tenant ID or Primary domain                     |
| `MSAL_CLIENT_ID`     | Client ID of the application you registered     |
| `MSAL_CLIENT_SECRET` | Client secret of the application you registered |

***Note!*** You may also ask fellow developer in your organization to share their, so 
you don't need to setup your own Microsoft tenant. Check [Microsoft's guide on 
how to register your 
application](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-web-app-nodejs-msal-sign-in#step-1-register-your-application).

### Configuring Kraftwerk integration

| Environment Variable   | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `KRAFTWERK_URL`        | Full URL where the Kraftwerk service exists                        |

### Configuring Rasenmaeher integration

The SSO code generation from Rasenmaeher requires Tilauspalvelu to have it's own private and public RSA keys for RS256 JWT auth.

***Note!*** These are already included for development purposes for the local docker environment.

| Environment Variable   | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `JWT_PRIVATE_KEY_FILE` | Private key for Tilauspalvelu to sign JWTs                         |
| `JWT_PUBLIC_KEY_FILE`  | Public key for other services to verify Tilauspalvelu's JWT tokens |

### Configuring the PostgreSQL database

We use standard Azure database variables, so everything should work out of the box in the production as well.

These are also already included for development purposes for the local docker environment. So you probably don't need to do much.

| Environment Variable        | Description                       |
| --------------------------- | --------------------------------- |
| `AZURE_POSTGRESQL_HOST`     | The PostgreSQL hostname           |
| `AZURE_POSTGRESQL_USER`     | The PostgreSQL user               |
| `AZURE_POSTGRESQL_DATABASE` | The PostgreSQL database name      |
| `AZURE_POSTGRESQL_PORT`     | The PostgreSQL port               |
| `AZURE_POSTGRESQL_SSL`      | Should we use secure connections  |
| `AZURE_POSTGRESQL_PASSWORD` | The PostgreSQL password           |

## Running the development environment

Start the backend:

```
docker-compose build && docker-compose up
```

Start the frontend (in another console):

```
cd ./frontend
npm start
```

...and open http://localhost:3000/

## Working on git submodules

Our git submodules are intentionally checked out using HTTPS links to enable 
read only access for 3rd parties and the C/I systems.

In case you want to work on these projects and have a write access to these  
git projects, you can configure git to use SSH instead of HTTPS:

For HyperifyIO projects (will replace Sendanor and HG later):

```
git config --global url."git@github.com:hyperifyio/".insteadOf "https://github.com/hyperifyio/"
```

For Sendanor projects:

```
git config --global url."git@github.com:sendanor/".insteadOf "https://github.com/sendanor/"
```

For HG projects:

```
git config --global url."git@github.com:heusalagroup/".insteadOf "https://github.com/heusalagroup/"
```

## Port numbers

| Port | Description                               |
| ---- | ----------------------------------------- |
| 3000 | Planner frontend port                     |
| 3001 | Planner API port                          |
| 4001 | (Mock) Kraftwerk & Rasenmaeher API port   |
