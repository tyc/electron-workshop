const electron = require('electron')
const marked = require('marked')
const ipc = electron.ipcRenderer
const $ = selector => document.querySelector(selector)

const $markdownView = $('.raw-markdown')
const $htmlView = $('.rendered-html')
const $openFileButton = $('#open-file')
const $saveFileButton = $('#save-file')
const $copyHtmlButton = $('#copy-html')



function renderMarkdownToHtml(markdown) {
    const html = marked(markdown)
    $htmlView.innerHTML = html
}

$markdownView.addEventListener('keyup', (event) => {
    const content = event.target.value
    renderMarkdownToHtml(content)
})

ipc.on('file-opened',(event,file,content) => {
    $markdownView.value = content
    renderMarkdownToHtml(content)
})
