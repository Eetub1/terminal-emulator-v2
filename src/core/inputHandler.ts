import { CommandHandler } from "./CommandHandler"
import { renderUserInputOnScreen } from "../ui/terminal/prompt"

import { AppState } from "../types"


export const handleUserInput = (event: KeyboardEvent, commandHandler: CommandHandler): void => {
    const key = event.key
    const state = commandHandler.getApplicationState()

    if (state === AppState.Terminal) {
        handleTerminalInput(key, commandHandler)
    } else {
        // handleEditorInput(key, commandHandler)
    }
}


const handleTerminalInput = (key: string, commandHandler: CommandHandler): void => {
    const buffer = commandHandler.getTerminalBuffer()

    switch (key) {
        case "Enter":
        {
            const userInput = buffer.getText()
            commandHandler.handleCommand(userInput)
            buffer.clearBuffer()
            break
        }
        case "ArrowRight":
            buffer.moveCursorRight()
            break
        case "ArrowLeft":
            buffer.moveCursorLeft()
            break
        case "ArrowUp":
            // TODO previous command
            break
        case "Backspace":
            buffer.deleteCharacter()
            break
        default:
            if (key.length === 1) {buffer.addCharacter(key)}
            break
    }
    renderUserInputOnScreen(buffer.getText(), buffer.getCursorIndex())
}