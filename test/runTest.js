const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
    try {
        // The path to the extension root directory
        const extensionDevelopmentPath = path.resolve(__dirname, '../');

        // The path to the test runner script (your test file)
        const extensionTestsPath = path.resolve(__dirname, './extension.test.js');

        // Run the extension tests
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
