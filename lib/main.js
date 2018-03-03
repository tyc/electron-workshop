const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const dialog = electron.dialog
const fs = require('fs')


const template = [
	{
	  label: 'File',
	  submenu: [
		{
		  label: 'Open...',
		  accelerator: 'CmdOrCtrl+O',
		  click () { openFile() }
		},
		{
		  label: 'Save...',
		  accelerator: 'CmdOrCtrl+S',
		  click () {
			// We can't call saveFile(content) directly because we need to get
			// the content from the renderer process. So, send a message to the
			// renderer, telling it we want to save the file.
			mainWindow.webContents.send('save-file')
		  }
		}
	  ]
	},
	{
	  label: 'Edit',
	  submenu: [
		{
		  label: 'Undo',
		  accelerator: 'CmdOrCtrl+Z',
		  role: 'undo'
		},
		{
		  label: 'Redo',
		  accelerator: 'Shift+CmdOrCtrl+Z',
		  role: 'redo'
		},
		{
		  type: 'separator'
		},
		{
		  label: 'Cut',
		  accelerator: 'CmdOrCtrl+X',
		  role: 'cut'
		},
		{
		  label: 'Copy',
		  accelerator: 'CmdOrCtrl+C',
		  role: 'copy'
		},
		{
		  label: 'Paste',
		  accelerator: 'CmdOrCtrl+V',
		  role: 'paste'
		},
		{
		  label: 'Select All',
		  accelerator: 'CmdOrCtrl+A',
		  role: 'selectall'
		}
	  ]
	},
	{
	  label: 'Developer',
	  submenu: [
		{
		  label: 'Toggle Developer Tools',
		  accelerator: process.platform === 'darwin'
			? 'Alt+Command+I'
			: 'Ctrl+Shift+I',
		  click () { mainWindow.webContents.toggleDevTools() }
		}
	  ]
	}
  ]
  
  if (process.platform === 'darwin') {
	const name = app.getName()
	template.unshift({
	  label: name,
	  submenu: [
		{
		  label: 'About ' + name,
		  role: 'about'
		},
		{
		  type: 'separator'
		},
		{
		  label: 'Services',
		  role: 'services',
		  submenu: []
		},
		{
		  type: 'separator'
		},
		{
		  label: 'Hide ' + name,
		  accelerator: 'Command+H',
		  role: 'hide'
		},
		{
		  label: 'Hide Others',
		  accelerator: 'Command+Alt+H',
		  role: 'hideothers'
		},
		{
		  label: 'Show All',
		  role: 'unhide'
		},
		{
		  type: 'separator'
		},
		{
		  label: 'Quit',
		  accelerator: 'Command+Q',
		  click () { app.quit() }
		}
	  ]
	})
  }


const Menu = electron.Menu
const menu = Menu.buildFromTemplate(template)

fileName = ''

exports.openFile = openFile
exports.saveFile = saveFile
exports.saveFileAs = saveFileAs

function saveFileAs(content) {
	fileName = ''
	saveFile(content)
}

function saveFile(content) {
	
	if (fileName == '') {
		fileName = dialog.showSaveDialog ( mainWindow, {
			title: 'Save HTML output',
			defaultPath: app.getPath('documents'),
			filters: [
				{ name: 'HTML Files', extensions: ['html']}
			]
		})	
	}

	if (!fileName) return

	fs.writeFileSync(fileName, content)
}


function openFile() {
	const files = dialog.showOpenDialog(mainWindow, {
		properties: ['openFile','multiSelections'],
		filters: [
			{ name: 'text files', extensions: ['txt', 'text', 'md']}
		]
	})


	if (!files) return

	const file = files[0]
	const content = fs.readFileSync(file).toString()

	console.log(content)
	mainWindow.webContents.send('file-opened', file, content)

	app.addRecentDocument(file)

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

app.on('ready', () => {
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})

app.on('open-file', (event, file) => {
	const content = fs.readFileSync(file).toString()
	mainWindow.webContents.send('file-opened', file, content)
})