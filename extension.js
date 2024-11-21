// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');
const arangojs = require('arangojs');

// Create a map to keep track of metadata for each document
const documentMap = new Map();

// This method is called when your extension is activated
function activate(context) {
    console.log('Congratulations, your extension "arangodbstudio" is now active!');

    // Register the command to connect to ArangoDB
    const connectCommand = vscode.commands.registerCommand('arangodbstudio.connect', async function () {
        try {
            const db = await connectToArangoDB();
            if (db) {
                vscode.window.showInformationMessage('Connected to ArangoDB successfully!');
                initializeTreeView(context, db);
                context.db = db; // Store the db instance in the context
            }
        } catch (error) {
            vscode.window.showErrorMessage('Error connecting to ArangoDB: ' + error.message);
        }
    });

    // Register command to open the document
    const openDocumentCommand = vscode.commands.registerCommand('arangodbstudio.openDocument', async (documentItem) => {
        try {
            if (documentItem instanceof DocumentItem) {
                // Fetch the latest version of the document from ArangoDB
                const collection = documentItem.db.collection(documentItem.collectionName);
                const latestDocument = await collection.document(documentItem.document._key);

                // Convert the document to JSON with pretty formatting
                const documentContent = JSON.stringify(latestDocument, null, 2);

                // Add a unique identifier (e.g., timestamp) to the URI to avoid caching issues
                const timestamp = new Date().getTime();
                const uri = vscode.Uri.parse(`arangodb:${documentItem.collectionName}/${documentItem.document._key}-${timestamp}.json`);

                // Open an untitled document in the editor with this content
                const doc = await vscode.workspace.openTextDocument({
                    content: documentContent,
                    language: 'json'
                });

                // Keep track of metadata in the documentMap using the document URI as the key
                documentMap.set(doc.uri.toString(), documentItem);

                await vscode.window.showTextDocument(doc);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to open document: ${error.message}`);
        }
    });

    // Register command to save document changes
    const saveDocumentCommand = vscode.commands.registerCommand('arangodbstudio.saveDocument', async () => {
        const activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor. Please open a document first.');
            return;
        }

        const textDocument = activeEditor.document;

        // Retrieve metadata from the documentMap
        const documentItem = documentMap.get(textDocument.uri.toString());

        if (!documentItem) {
            vscode.window.showErrorMessage('This document cannot be saved to ArangoDB.');
            return;
        }

        try {
            // Parse the JSON content of the document
            const updatedDocument = JSON.parse(textDocument.getText());

            // Get collection information from the document item
            const { db, collectionName, document: originalDocument } = documentItem;
            const collection = db.collection(collectionName);

            // Update the document in ArangoDB using the _key
            await collection.update(originalDocument._key, updatedDocument);

            vscode.window.showInformationMessage('Document updated successfully in ArangoDB!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to update document: ${error.message}`);
        }
    });

    context.subscriptions.push(connectCommand, openDocumentCommand, saveDocumentCommand);
}

// Function to prompt user for connection details and connect to ArangoDB
async function connectToArangoDB() {
    const serverUrl = await vscode.window.showInputBox({ prompt: 'Enter ArangoDB Server URL (e.g., http://localhost:8529)' });
    if (!serverUrl) throw new Error('Server URL is required');

    const username = await vscode.window.showInputBox({ prompt: 'Enter Username' });
    const password = await vscode.window.showInputBox({ prompt: 'Enter Password', password: true });

    const db = new arangojs.Database({
        url: serverUrl,
        auth: { username, password }
    });

    const databases = await db.listDatabases();
    const selectedDatabase = await vscode.window.showQuickPick(databases, { placeHolder: 'Select a Database' });

    if (!selectedDatabase) throw new Error('Database selection is required');

    const selectedDb = new arangojs.Database({
        url: serverUrl,
        databaseName: selectedDatabase,
        auth: { username, password }
    });

    return selectedDb;
}

// Function to initialize the tree view and show collections
function initializeTreeView(context, db) {
    const treeDataProvider = new ArangoDBTreeDataProvider(db);
    vscode.window.registerTreeDataProvider('arangodbCollections', treeDataProvider);
}

// Tree Data Provider to display ArangoDB collections
class ArangoDBTreeDataProvider {
    constructor(db) {
        this.db = db;
    }

    async getChildren(element) {
        try {
            if (!element) {
                const collections = await this.db.listCollections();
                return collections
                    .filter(col => !col.isSystem)
                    .map(col => new CollectionItem(col));
            } else if (element instanceof CollectionItem) {
                const collectionName = element.label;
                const query = `FOR doc IN ${collectionName} RETURN doc`;
                const cursor = await this.db.query(query);
                const documents = await cursor.all();
                return documents.map(doc => new DocumentItem(collectionName, doc, this.db));
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to get data from ArangoDB: ${error.message}`);
            return [];
        }
    }

    getTreeItem(element) {
        if (element instanceof DocumentItem) {
            element.command = {
                command: 'arangodbstudio.openDocument',
                title: 'Open Document',
                arguments: [element]
            };
        }
        return element;
    }
}

class CollectionItem extends vscode.TreeItem {
    constructor(collection) {
        super(collection.name, vscode.TreeItemCollapsibleState.Collapsed);
        this.contextValue = 'collection';
    }
}

class DocumentItem extends vscode.TreeItem {
    constructor(collectionName, document, db) {
        super(document._key, vscode.TreeItemCollapsibleState.None);
        this.contextValue = 'document';
        this.collectionName = collectionName;
        this.document = document;
        this.db = db; // Store reference to the db
    }
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
