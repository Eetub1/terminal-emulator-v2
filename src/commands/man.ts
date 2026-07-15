import type { Command, CommandContext, CommandResult } from "../types"
import { FileSystem } from "../core/FileSystem"

export const manCommand: Command = {
    name: "man",
    description: "Displays system documentation",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], _fileSystem: FileSystem, commandContext: CommandContext): CommandResult => {
        const commandName = args[0]!
        const command = commandContext.findCommand(commandName)

        if (command) {
            return {lines: [command.description]}
        } else {
            return {lines: [`Couldn't find command: ${commandName}`], isError: true}
        }
    }
}