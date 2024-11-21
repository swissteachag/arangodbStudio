# arangodbstudio README

Welcome to ArangoDB Studio, a Visual Studio Code extension designed to help you manage and interact with ArangoDB collections directly from your editor. With ArangoDB Studio, you can connect to an ArangoDB server, browse collections, open documents for editing, and save changes back to the server—all within the convenience of VS Code.

## Features

- **Connect to ArangoDB**: Easily connect to your ArangoDB server by providing the server URL, username, and password.
- **Browse Collections**: View all available collections from the connected database, including options to expand and see individual documents.
- **Edit Documents**: Open any document in the VS Code editor, modify it, and save the changes directly to ArangoDB.
- **Save Changes**: Use a dedicated save command to update documents in the ArangoDB server after editing.

### Screenshots

Below is an example of the extension in action:

- Browse ArangoDB Collections  
  ![Browsing Collections](images/browse-collections.png)
- Edit and Save Documents  
  ![Editing Documents](images/edit-document.png)

> Tip: Utilize VS Code's split editor feature to view documents side by side and manage multiple ArangoDB documents simultaneously.

## Requirements

- **Node.js** and **npm**: Required to install the extension dependencies and run the development server.
- **ArangoDB Server**: Ensure you have access to an ArangoDB server instance to connect.

## Extension Settings

Currently, ArangoDB Studio does not add any configurable settings to VS Code. Future versions may include options for customizing connection behavior or editor features.

## Known Issues

- **Caching of Documents**: Previously opened documents may be cached by VS Code, causing old versions to display when reopened. This issue is mitigated by forcing fresh fetches of document data.
- **Save Command Required**: Users must manually run the "Save ArangoDB Document" command to persist changes to the server.

## Release Notes

### 0.0.1

Initial release of ArangoDB Studio, featuring:
- Connect to ArangoDB
- Browse and manage collections
- Edit and save documents within VS Code


**Enjoy managing your ArangoDB collections with ArangoDB Studio!**
