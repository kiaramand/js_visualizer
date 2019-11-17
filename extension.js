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
		const buffer = fs.readFileSync('/Users/kanderson/Desktop/linterTest.js').toString()
		const body = acorn.parse(buffer).body
		console.log(body)

		class Interpreter {
			constructor(visitor) {
				this.visitor = visitor
			}
			interpret(nodes) {
				return this.visitor.run(nodes)
			}
		}

		class Visitor {
			visitExpressionStatement(node) {
				let callee = node.expression.callee.name
				let args = node.expression.arguments
				let formattedArgs = args.map(arg => arg.value).join(', ')
				console.log(`fuction that was called: ${callee}(${formattedArgs})`)
			}
			visitNode(node) {
				// ForStatement (body -> body (array)), WhileStatement (body -> body (array)), IfStatement (consequense -> body (array)), FunctionDeclaration (body -> body (array))
				// pattern... if they have a .body.type of BlockStatement, it could contain a function call
				// check for nested ExpressionStatement
				// ^ do recursive call, sending the current node to visitNodes?
				// if (node.body) {
				// 	if (node.body.type === 'BlockStatement') {
				// 		this.visitNodes(node.body.body)
				// 	}
				// }
				// when parsed and handled this way, we see the order in which they're written, not taking into account the actual order in which they're invoked
				switch (node.type) {
					case 'ExpressionStatement':
						return this.visitExpressionStatement(node)
					default:
						return `node type ${node.type} not handled`
				}
			}
			visitNodes(nodes) {
				for (const node of nodes) {
					this.visitNode(node)
				}
			}
			run(nodes) {
				return this.visitNodes(nodes) //site says .visitNodes(body) ??
			}
		}

		const jsInterpreter = new Interpreter(new Visitor())
		jsInterpreter.interpret(body)

		// for(let i = 0; i < body.length; i++) {
		// 	let node = body[i]
		// 	switch (node.type) {
		// 		case 'ExpressionStatement':
		// 			let callee = node.expression.callee.name
		// 			let args = node.expression.arguments
		// 			let formatted = args.map(arg => {
		// 				return arg.value
		// 			}).join(', ')
		// 			console.log(`fuction that was called: ${callee}(${formatted})`)
		// 	}
		// }

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
