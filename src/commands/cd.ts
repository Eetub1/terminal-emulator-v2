import type { Command } from "../types"
import { FileSystem } from "../core/FileSystem"

export const cdCommand: Command = {
    name: "cd",
    description: "Change the working directory",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem) => {
        const result = fileSystem.validatePath(args[0]!)

        if (result.exists === false) {
            return {lines: [`Couldn't find directory: ${args[0]}`], isError: true}
        }

        fileSystem.setCurrentDirectory(result.directory!)
        return {lines: []}
    }
}