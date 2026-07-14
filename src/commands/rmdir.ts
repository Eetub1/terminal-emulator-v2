import type { Command, CommandResult, DeleteDirectoryResultObject } from "../types"
import { FileSystem } from "../core/FileSystem"

export const rmdirCommand: Command = {
    name: "rmdir",
    description: "Deletes a directory",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem): CommandResult => {
        const dirName = args[0]!
        
        const result: DeleteDirectoryResultObject = fileSystem.deleteDirectory(dirName)
        if (result.wasSuccess) {
            return {lines: [], }
        } else {
            return {lines: [result.message], isError: true}
        }
    }
}