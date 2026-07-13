import type { Command } from "../types"
import type { CommandResult } from "../types"

import { FileSystem } from "../core/FileSystem"

export const lsCommand: Command = {
    name: "ls",
    description: "Lists directory contents",
    minArgs: 0,
    maxArgs: 0,
    execute: (_args: string[], fileSystem: FileSystem): CommandResult => {
        const filesAndDirs: string[] = fileSystem.getCurrentDirectory().getChildDirectoriesAndFiles()
        return {lines: filesAndDirs}
    }
}