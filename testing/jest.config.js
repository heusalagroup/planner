/**
 * Test scopes to include in the test.
 *
 *  - unit
 *  - system
 *  - hyperify
 *
 *  Defaults to "all" which means all above.
 *
 * @type {string[]}
 */
let TEST_SCOPES = (process.env.TEST_SCOPES ? process.env.TEST_SCOPES : "all").split(/[ ,|]/).map((item) => item.trim().toLowerCase());
if (TEST_SCOPES.length === 0) {
    TEST_SCOPES = ['unit'];
}

const TEST_TIMEOUT = parseInt( process.env.TEST_TIMEOUT ? process.env.TEST_TIMEOUT : '300000', 10);

console.info(`
TEST_SCOPES: ${TEST_SCOPES}
TEST_TIMEOUT: ${TEST_TIMEOUT}
`);

const all = TEST_SCOPES.includes("all");

const projects = [

    ...( TEST_SCOPES.includes("hyperify")         ? [ "./src/io/hyperify/core"       ] : []),
    ...( TEST_SCOPES.includes("hyperify")         ? [ "./src/io/hyperify/frontend"       ] : []),
    ...( TEST_SCOPES.includes("hyperify")         ? [ "./src/io/hyperify/mysql"       ] : []),
    ...( TEST_SCOPES.includes("hyperify")         ? [ "./src/io/hyperify/node"       ] : []),
    ...( TEST_SCOPES.includes("hyperify")         ? [ "./src/io/hyperify/pg"       ] : []),

    ...( all || TEST_SCOPES.includes("unit")       ? [ "./src/fi/heusalagroup/planner"     ] : []),

    ...( all || TEST_SCOPES.includes("system")     ? [ "./src/system"   ] : []),

];

if (projects.length === 0) {
    throw new TypeError('No projects selected');
}

/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    projects,
    testTimeout: TEST_TIMEOUT,
    moduleNameMapper: {
        '\\.(scss|css|less)$': '<rootDir>/src/io/hyperify/testing/mocks/styleMock.js',
    },
    transform: {
        '\\.(scss|css|less)$': '<rootDir>/src/io/hyperify/testing/jest/fileTransformer.js'
    },
    setupFilesAfterEnv: [
        "./node_modules/ts-jest/globals.d.ts",
        "./src/globals.d.ts",
        "./src/io/hyperify/testing/jest/matchers/index.ts",
        "./src/io/hyperify/testing/jest/matchers/globals.d.ts",
    ]
};
