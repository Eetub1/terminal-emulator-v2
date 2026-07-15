import "./assets/style.css"
import { renderDefaultTerminalScreen } from "./ui/terminal/prompt"

import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
import { FileSystem } from "./core/FileSystem"
import { Output } from "./ui/terminal/Output"
import { CommandHandler } from "./core/CommandHandler"
import { VimEditor } from "./core/editor/VimEditor"

import { handleTerminalInput } from "./core/terminal/handleTerminalInput"
import { handleEditorInput } from "./core/editor/handleEditorInput"

import { AppState } from "./types"

const vimEditor = new VimEditor()
const terminalBuffer = new TerminalBuffer()
const fileSystem = new FileSystem()
const outputHandler = new Output()
const commandHandler = new CommandHandler(terminalBuffer, fileSystem, outputHandler)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Tab" || event.key === " ") {
        event.preventDefault() // We want to use tab and space
    }
    
    const state = commandHandler.getApplicationState()

    if (state === AppState.Terminal) {
        handleTerminalInput(event, commandHandler)
    } else {
        handleEditorInput(event, commandHandler)
    }
})

const main = () => {
    renderDefaultTerminalScreen(fileSystem.getPath())
}

main() // Start program