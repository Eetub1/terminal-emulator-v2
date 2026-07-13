import { CommandHandler } from "./CommandHandler"
import { renderUserInputOnScreen } from "../ui/terminal/prompt"


export const handleUserInput = (event: KeyboardEvent, commandHandler: CommandHandler): void => {
    const key = event.key

    handleTerminalKeyPress(key, commandHandler) // Delegate key press to right handler
}


const handleTerminalKeyPress = (key: string, commandHandler: CommandHandler): void => {
    const buffer = commandHandler.getTerminalBuffer()

    switch (key) {
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