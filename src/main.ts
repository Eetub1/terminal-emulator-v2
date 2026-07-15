import "./assets/style.css"

import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
//import { DocumentBuffer } from "./core/editor/DocumentBuffer"
import { VimEditor } from "./core/editor/VimEditor"
import { FileSystem } from "./core/FileSystem"
import { Output } from "./ui/terminal/Output"
import { App } from "./core/App"


const fileSystem = new FileSystem()
const terminalBuffer = new TerminalBuffer()
//const documentBuffer = new DocumentBuffer()
// const vimEditor = new VimEditor(documentBuffer) TODO!
const vimEditor = new VimEditor()
const output = new Output()


const app = new App(fileSystem, terminalBuffer, vimEditor, output)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    app.handleKey(event)
})

app.start()