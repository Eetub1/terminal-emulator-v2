import "./assets/style.css"

import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
import { DocumentBuffer } from "./core/editor/DocumentBuffer"
import { VimEditor } from "./core/editor/VimEditor"
import { FileSystem } from "./core/FileSystem"
import { Output } from "./ui/terminal/Output"
import { App } from "./core/App"


const documentBuffer = new DocumentBuffer() // tracks user input in editor
const fileSystem = new FileSystem()
const terminalBuffer = new TerminalBuffer()
const vimEditor = new VimEditor(documentBuffer)
const output = new Output()


const app = new App(fileSystem, terminalBuffer, vimEditor, output)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key
    if (key === "Tab" || key === "ArrowDown" || key === "ArrowUp" || event.key === " ") {
        event.preventDefault()
    }

    app.handleKey(event)
})

app.start()