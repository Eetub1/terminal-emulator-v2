import type { Command, CommandResult } from "../types"
import { FileSystem } from "../core/FileSystem"

export const echoCommand: Command = {
    name: "echo",
    description: "Writes it's own arguments to standard output",
    minArgs: 0,
    maxArgs: null,
    execute: (args: string[], _fileSystem: FileSystem): CommandResult => {
        return {lines: [args.join(" ")]}
    }
}