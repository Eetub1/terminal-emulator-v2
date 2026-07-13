import type { CommandResult } from "../../types"

export class Output {

    private history: string[]

    constructor() {
        this.history = []
    }

    /**
     * Appends the given command and the contents of the prompt directory to history and 
     * also to the screen
     * @param promptText   what is the current directory
     * @param commandInput string containing the command that was executed 
     */
    appendCommandToHistory(promptText: string, commandInput: string): void {
        const historyContainer = document.getElementById("history")!

        let wholeTerminalText = promptText + " " + commandInput
        this.history.push(wholeTerminalText)

        const p = document.createElement("p")
        p.textContent = wholeTerminalText
        historyContainer.appendChild(p)
    }


    appendCommandOutputToHistory(output: CommandResult): void {
        const historyContainer = document.getElementById("history")!

        const p = document.createElement("p")
        const line = output.lines.join(" ")
        p.textContent = line
        this.history.push(line)

        if (output.isError) p.classList.add("error")

        historyContainer.appendChild(p)
    }


    getHistory(): string[] {
        return this.history
    }
}