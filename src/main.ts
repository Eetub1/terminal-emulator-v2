import "./assets/style.css"
import { renderDefaultTerminalScreen } from "./ui/terminal/prompt"
import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
import { FileSystem } from "./core/FileSystem"
import { Output } from "./ui/terminal/Output"
import { CommandHandler } from "./core/CommandHandler"
import { handleTerminalInput } from "./core/terminal/handleTerminalInput"

import { AppState } from "./types"

const terminalBuffer = new TerminalBuffer()
const fileSystem = new FileSystem()
const outputHandler = new Output()
const commandHandler = new CommandHandler(terminalBuffer, fileSystem, outputHandler)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Tab" || event.key === " ") {
        event.preventDefault() // We want to use tab and space
    }
    
    const key = event.key
    const state = commandHandler.getApplicationState()

    if (state === AppState.Terminal) {
        handleTerminalInput(key, commandHandler)
    } else {
        // handleEditorInput(key, commandHandler)
    }
})

const main = () => {
    renderDefaultTerminalScreen(fileSystem.getPath())
}

main() // Start program