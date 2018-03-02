const electron = require('electron')
const marked = require('marked')
const remote = electron.remote
const ipc = electron.ipcRenderer
const $ = selector => document.querySelector(selector)
const clipboard = remote.clipboard

const mainProcess = remote.require('./main')
const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')

// this allows the status or event to be returned from
// each button.
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-html')
const $copyHtmlButton = $('#copy-html')
const $saveFileAsButton = $('#save-as')


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
    $markdownView.value = content
    renderMarkdownToHtml(content)
})


