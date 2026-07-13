import "./assets/style.css"
import { renderDefaultPrompt } from "./ui/terminal/prompt"
import { handleUserInput } from "./core/inputHandler" 
import { TerminalBuffer } from "./core/terminal/TerminalBuffer"
import { CommandHandler } from "./core/CommandHandler"

const terminalBuffer = new TerminalBuffer()
const commandHandler = new CommandHandler(terminalBuffer)

window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Tab") {
        event.preventDefault() // We want to use tab for autocomplete
    }

    handleUserInput(event, commandHandler)
})

const main = () => {
    renderDefaultPrompt()
}

main() // Start program