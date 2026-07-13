import type { ParsedCommand } from "../types"

export class CommandParser {

    /*when we implement the | operator, this could just return an array of these*/
    parseCommand(input: string): ParsedCommand {
        const cleanedInput = input.trim()

        if (cleanedInput === "") {
            return {
                name: "",
                args: []
            }
        }

        const parts: string[] = cleanedInput.split(" ")
        const name: string = parts[0]!
        const args: string[] = parts.slice(1)
        return { name, args }
    }
}