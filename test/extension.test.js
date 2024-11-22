const assert = require('assert');
const vscode = require('vscode');

describe('ArangoDB Studio Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    it('Activate Extension', async () => {
        const extension = vscode.extensions.getExtension('swissteach-ag.arangodbstudio');
        assert.ok(extension, 'Extension should be present');
        await extension.activate();
        assert.strictEqual(extension.isActive, true, 'Extension should be activated');
    });

    it('Command Registration', async () => {
        const extension = vscode.extensions.getExtension('swissteach-ag.arangodbstudio');
        assert.ok(extension, 'Extension should be present');
        await extension.activate();

        // Add a small delay to ensure all commands are registered
        await new Promise(resolve => setTimeout(resolve, 1000));

        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('arangodbstudio.connect'), 'Connect command should be registered');
        assert.ok(commands.includes('arangodbstudio.saveDocument'), 'Save Document command should be registered');
    });

    it('Connect to ArangoDB Command', async () => {
        const extension = vscode.extensions.getExtension('swissteach-ag.arangodbstudio');
        assert.ok(extension, 'Extension should be present');
        await extension.activate();

        let commandExecuted = false;

        const disposable = vscode.commands.registerCommand('arangodbstudio.connect', () => {
            commandExecuted = true;
        });

        await vscode.commands.executeCommand('arangodbstudio.connect');
        assert.strictEqual(commandExecuted, true, 'Connect to ArangoDB command should be executed');

        disposable.dispose();
    });
});
