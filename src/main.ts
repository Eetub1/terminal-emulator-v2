import "./assets/style.css"

import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
import { FileSystem } from "./core/FileSystem"
import { Output } from "./ui/terminal/Output"
import { App } from "./core/App"

const fileSystem = new FileSystem()
const terminalBuffer = new TerminalBuffer()       // Normal terminal
const output = new Output()
const app = new App(fileSystem, terminalBuffer, output)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key
    if (key === "Tab" || key === "ArrowDown" || key === "ArrowUp" || event.key === " ") {
        event.preventDefault()
    }

    app.handleKey(event)
})

app.start()