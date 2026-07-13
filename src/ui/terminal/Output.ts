import type { CommandResult } from "../../types"
import { getCurrentPromptDirectory } from "./prompt"

export class Output {

    private history: string[]

    constructor() {
        this.history = []
    }

    /**
     * Appends the given command and the contents of the prompt directory to history and 
     * also to the screen
     * @param commandInput string containing the command that was executed 
     */
    appendCommandToHistory(commandInput: string): void {
        const historyContainer = document.getElementById("history")!
        const promptDirectory = getCurrentPromptDirectory()

        let wholeTerminalText = promptDirectory + " " + commandInput
        this.history.push(wholeTerminalText)

        const p = document.createElement("p")
        p.textContent = wholeTerminalText
        historyContainer.appendChild(p)
    }

    appendCommandOutputToHistory(output: CommandResult): void {
        const historyContainer = document.getElementById("history")!

        const p = document.createElement("p")
        p.textContent = output.lines.join(" ")

        if (output.isError) p.classList.add("error")

        historyContainer.appendChild(p)
    }

    getHistory(): string[] {
        return this.history
    }
}