const electron = require('electron')
const marked = require('marked')
const remote = electron.remote
const ipc = electron.ipcRenderer
const $ = selector => document.querySelector(selector)
const clipboard = remote.clipboard
const shell = electron.shell

const mainProcess = remote.require('./main')
const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')

// this allows the status or event to be returned from
// each button.
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-html')
const $copyHtmlButton = $('#copy-html')
const $saveFileAsButton = $('#save-as')
const $showInFileSystemButton = $('#show-in-file-system')
const $openInDefaultEditorButton = $('#open-in-default-editor')

let currentFile = null

$saveFileAsButton.addEventListener('click', () => {
    const html = $htmlView.innerHTML
    mainProcess.saveFileAs(html)    
})


function renderMarkdownToHtml(markdown) {
    const html = marked(markdown)
    $htmlView.innerHTML = html
}

$saveFileButton.addEventListener('click', () => {
    const html = $htmlView.innerHTML
    mainProcess.saveFile(html)
})

$copyHtmlButton.addEventListener('click', () => {
    const html =$htmlView.innerHTML
    clipboard.writeText(html)
})

$openFileButton.addEventListener('click', () => {
    mainProcess.openFile()
})

$markdownView.addEventListener('keyup', (event) => {
    const content = event.target.value
    renderMarkdownToHtml(content)
})

ipc.on('file-opened',(event,file,content) => {
    currentFile = file

    $showInFileSystemButton.disabled = false
    $openInDefaultEditorButton.disabled = false
  
    $markdownView.value = content
    renderMarkdownToHtml(content)
})

ipc.on('save-file', (event) => {
    const html = $htmlView.innerHTML
    mainProcess.saveFile(html)
})

// shell allows it to execute system level actions, such as lauching
// the default browser when the link is clicked.
document.body.addEventListener('click', (event) => {
    if (event.target.matches('a[href^="http"]')) {
      event.preventDefault()
      shell.openExternal(event.target.href)
    }
  })

  $showInFileSystemButton.addEventListener('click', () => {
    shell.showItemInFolder(currentFile)
  })
  
  $openInDefaultEditorButton.addEventListener('click', () => {
    shell.openItem(currentFile)
  })
