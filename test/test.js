const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

// Instantiate a Mocha instance.
const mocha = new Mocha({
    timeout: 300000
});

// May pass in a custom test dir, ie. units or integration
buildTestSuite(`./test/${process.env.TEST_DIR || ''}`);

// START test suite
runTestSuite();

/**
 * Execute the test suite as defined within the tests array.
 */
async function runTestSuite() {
    mocha.run(async(failures) => {
        process.exit(failures);
    });
}

/**
 * Add test files in specific suite to the mocha suite
 * @param {String} testDir which dir to build the test files from
 */
function buildTestSuite(testDir) {
    fs.readdirSync(testDir).filter((file) => {
        return file.substr(-3) === '.js';

    }).forEach((file) => {
        mocha.addFile(
            path.join(testDir, file)
        );
    });
}