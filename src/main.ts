import "./assets/style.css"
import { renderDefaultPrompt } from "./ui/terminal/prompt"
import { handleUserInput } from "./core/inputHandler" 
import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
import { FileSystem } from "./core/FileSystem"
import { Output } from "./ui/terminal/Output"
import { CommandHandler } from "./core/CommandHandler"


const terminalBuffer = new TerminalBuffer()
const fileSystem = new FileSystem()
const outputHandler = new Output()
const commandHandler = new CommandHandler(terminalBuffer, fileSystem, outputHandler)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Tab" || event.key === " ") {
        event.preventDefault() // We want to use tab for autocomplete
    }
    handleUserInput(event, commandHandler)
})

const main = () => {
    renderDefaultPrompt()
}

main() // Start program