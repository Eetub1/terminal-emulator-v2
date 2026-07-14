import type { CommandResult } from "../../types"

export class Output {

    private history: string[]

    constructor() {
        this.history = []
    }

    /**
     * Appends the given command and the contents of the prompt directory to history and 
     * draws it on screen
     * @param promptText   what is the current directory
     * @param commandInput string containing the command that was executed 
     */
    appendCommandToHistory(promptText: string, commandInput: string): void {
        const historyContainer = document.getElementById("history")!

        const wholeTerminalText = promptText + " " + commandInput
        this.history.push(wholeTerminalText)

        const p = document.createElement("p")
        p.textContent = wholeTerminalText
        historyContainer.appendChild(p)
    }


    /**
     * Appends the text output of the command to history and to screen
     * @param output 
     */
    appendCommandOutputToHistory(output: CommandResult): void {
        const historyContainer = document.getElementById("history")!

        const p = document.createElement("p")
        const line = output.lines.join(" ")
        p.textContent = line
        this.history.push(line)

        if (output.isError) p.classList.add("error")

        historyContainer.appendChild(p)
    }


    /**
     * This function is called when the autocomplete find 2 or more matches.
     * Adds the current prompt state to history and outputs all possible matches.
     * @param path            The path to current directory
     * @param possibleMatches Array of possible string matches
     * @param terminalInput   What user has typed into the terminal
     */
    handleAutocompleteOutput(path: string, possibleMatches: string[], terminalInput: string): void {
        this.appendCommandToHistory("user@emulator:" + path + "$ ", terminalInput)
        this.appendCommandToHistory("", possibleMatches.join(" "))
    }


    getHistory(): string[] {
        return this.history
    }
}