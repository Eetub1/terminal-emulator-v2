import type { CommandResult } from "../../types"

export class Output {

    private history: string[]

    constructor() {
        this.history = []
    }

    /**
     * Appends the given command and the contents of the prompt directory to history and 
     * draws it on screen
     * @param curPath   what is the current directory
     * @param commandInput string containing the command that was executed 
     */
    appendCommandToHistory(curPath: string, commandInput: string): void {
        if (curPath.length !== 1) curPath = curPath.slice(0, -1)
        if (curPath === "/home/user") curPath = "~"

        let fullPromptText = ""
        if (curPath.length !== 0) fullPromptText = "user@emulator:" + curPath + "$ "

        const historyContainer = document.getElementById("history")!

        const wholeTerminalText = fullPromptText + " " + commandInput
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
     * @param curPath         The path to current directory
     * @param possibleMatches Array of possible string matches
     * @param terminalInput   What user has typed into the terminal
     */
    handleAutocompleteOutput(curPath: string, possibleMatches: string[], terminalInput: string): void {
        this.appendCommandToHistory(curPath, terminalInput)
        this.appendCommandToHistory("", possibleMatches.join(" "))
    }


    getHistory(): string[] {
        return this.history
    }
}