import type { Command, CommandResult } from "../types"
import { FileSystem } from "../core/FileSystem"

export const mkdirCommand: Command = {
    name: "mkdir",
    description: "Makes a directory",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem): CommandResult => {
        const dirName = args[0]!
        const result = fileSystem.createDirectory(dirName)

        if (result) {
            return {lines: []}
        }
        return {lines: ["Couldn't create directory"], isError: true}
    }
}