import type { Command, CommandResult } from "../types"
import { FileSystem } from "../core/FileSystem"

export const pwdCommand: Command = {
    name: "pwd",
    description: "Prints current working directory",
    minArgs: 0,
    maxArgs: 0,
    execute: (_args: string[], fileSystem: FileSystem): CommandResult => {
        const path = fileSystem.getCurrentDirectory().getPath()
        return {lines: [path]}
    }
}