const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
// const myExtension = require('../extension');


suite('ArangoDB Studio Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Activate Extension', async () => {
        const extension = vscode.extensions.getExtension('swissteach-ag.arangodbstudioarangodbstudio');
        assert.ok(extension, 'Extension should be present');
        await extension.activate();
        assert.strictEqual(extension.isActive, true, 'Extension should be activated');
    });

    test('Command Registration', async () => {
        const extension = vscode.extensions.getExtension('swissteach-ag.arangodbstudio.arangodbstudio');
        await extension.activate();

        const command = vscode.commands.getCommands(true);
        assert.ok(command.includes('arangodbstudio.connect'), 'Connect command should be registered');
        assert.ok(command.includes('arangodbstudio.openDocument'), 'Open Document command should be registered');
        assert.ok(command.includes('arangodbstudio.saveDocument'), 'Save Document command should be registered');
    });

    test('Connect to ArangoDB Command', async () => {
        const command = 'arangodbstudio.connect';
        let commandExecuted = false;

        const disposable = vscode.commands.registerCommand(command, () => {
            commandExecuted = true;
        });

        await vscode.commands.executeCommand(command);
        assert.strictEqual(commandExecuted, true, 'Connect to ArangoDB command should be executed');

        disposable.dispose();
    });
});
