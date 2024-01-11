# Planner

## Working on the development environment

### Fetching source code

```bash
git clone git@github.com:heusalagroup/planner.git planner
cd ./planner
git submodule update --init --recursive
cd ./api
```

### Build the server locally

```
npm run build
```

### Start the server locally

```
node ./dist/api.js
```

...and open http://0.0.0.0:3000

If you wish to use Docker instead, check *Using Docker environment* later.

## Using Docker environment

### Building the service using Docker

```bash
docker-compose build
```

### Starting the service using Docker

This is the easiest way to run the full environment.

```bash
docker-compose up
```

### Building the service using Docker in production mode

This docker setup does not actually use TypeScript tools to compile the backend 
again.

You need to have a compiled version available at `./dist/api.js`. You 
can also save it in git if you like to have compiled version available always.

```bash
docker-compose -f docker-compose.prod.yml build
```

And start the server:

```bash
docker-compose -f docker-compose.prod.yml up
```

## Other development scripts

To use our bundled scripts you need to set execution bit:

```bash 
chmod +x ./scripts/*.sh
```

### Listing state of git modules

```bash
./scripts/get-all-branches.sh
```

Run the `set-branch-main.sh` script if you see states like this:

```bash
$ ./scripts/get-all-branches.sh 
main    .
(HEAD detached at 34566e9)      src/fi/hg/core
(HEAD detached at 898988b)      src/fi/hg/create
```

When everything is correct you should see this:

```bash
$ ./scripts/get-all-branches.sh 
main    .
main    src/fi/hg/core
main    src/fi/hg/create
```

...unless you want to use some other branch...

### Adding new submodule

Here is how to add `io.hyperify.pg` git submodule to your project:

```bash
./scripts/add-hyperify-module.sh pg
```

### Changing all git modules to the `main` branch

```bash
./scripts/set-branch-main.sh
```

### Updating upstream git modules

```bash
./scripts/pull-all.sh
```
