## Testing environment

### Install test software

```shell
npm install
```

### Run unit tests

***WARNING!*** Our tests will modify the database heavily and also delete every existing workspace.

```shell
TEST_SCOPES=unit npm test
```

### Run system tests

***WARNING!*** Our tests will modify the database heavily and also delete every existing workspace.

```shell
TEST_SCOPES=system npm test
```

### Run full tests (includes 3rd party libraries)

***WARNING!*** Our tests will modify the database heavily and also delete every existing workspace.

```shell
TEST_SCOPES=all npm test
```

### Troubleshooting

#### `connect ECONNREFUSED 127.0.0.1:3500`

The backend is not running at port `3500`. Is the backend service up?

