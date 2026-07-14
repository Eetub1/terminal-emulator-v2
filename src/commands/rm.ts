import type { Command, CommandResult } from "../types"
import { FileSystem } from "../core/FileSystem"

export const rmCommand: Command = {
    name: "rm",
    description: "Removes a file",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem): CommandResult => {
        const filename = args[0]!
        const result = fileSystem.deleteFile(filename)

        if (!result) {
            return {lines: [`Couldn't find file: ${filename}`], isError: true}
        }
        return {lines: [], isError: false}
    }
}