import { renderUserInputOnScreen } from "../../ui/terminal/prompt"
import { CommandHandler } from "../CommandHandler"

export const handleTerminalInput = (event: KeyboardEvent, commandHandler: CommandHandler): void => {
    const key = event.key
    const buffer = commandHandler.getTerminalBuffer()

    switch (key) {
        case "Tab":
            commandHandler.handleInputAutocomplete()
            break
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
            commandHandler.previousCommand()
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