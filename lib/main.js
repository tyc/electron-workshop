const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const dialog = electron.dialog
const fs = require('fs')

exports.openFile = openFile

function openFile() {
	const files = dialog.showOpenDialog(mainWindow, {
		properties: ['openFile','multiSelections']
//		filters: [
//			{ name: 'text files', extensions: ['txt', 'text', 'md']}
//		]
	})

	if (!files) return

	const file = files[0]
	const content = fs.readFileSync(file).toString()

	console.log(content)
	mainWindow.webContents.send('file-opened', file, content)
}

app.on('ready', () => {
	console.log('The application is ready.')
	
	mainWindow = new BrowserWindow({alwaysOnTop: true})

	mainWindow.loadURL('file://'+path.join(__dirname, 'index.html'))

	// mainWindow.webContents.on('did-finish-load', () => {
	// 	openFile()
	// })

	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', () => {
		mainWindow = null
	})
})

