import type { Command, CommandResult } from "../types"
import { FileSystem } from "../core/FileSystem"
import { CommandHandler } from "../core/CommandHandler"

export const manCommand: Command = {
    name: "man",
    description: "Displays system documentation",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], _fileSystem: FileSystem, commandHandler?: CommandHandler): CommandResult => {
        const commands = commandHandler!.getCommands()
        const commandName = args[0]!
        const hasCommand = commands.has(commandName)

        if (hasCommand) {
            const command = commands.get(commandName)!
            return {lines: [command.description]}
        } else {
            return {lines: [`Couldn't find command: ${commandName}`], isError: true}
        }
    }
}