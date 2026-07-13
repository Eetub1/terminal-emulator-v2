import type { Command } from "../types"
import type { CommandResult } from "../types"

import { FileSystem } from "../core/FileSystem"


export const touchCommand: Command = {
    name: "touch",
    description: "Makes a file",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem): CommandResult =>  {
        const filename = args[0]!
        const result = fileSystem.createFile(filename)
        return {lines: [], isError: result}
    }
}