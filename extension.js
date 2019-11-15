// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const acorn = require('acorn')
const fs = require('fs')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "js-visualizer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.jSVisualizer', function () {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('JS Visualizer is running!');
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			vscode.window.showInformationMessage('please open a text editor')
			return
		}
		const text = editor.document.getText()
		vscode.window.showInformationMessage(`text in active editor: ${text}`)
		//const args = process.argv[2]
		//const fileUrl = new URL('file:///Users/kanderson/Desktop/linterTest.js')
		const buffer = fs.readFileSync('/Users/kanderson/Desktop/linterTest.js').toString()
		const body = acorn.parse(buffer).body
		console.log(body)


	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
