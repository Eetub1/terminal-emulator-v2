import type { Command, CommandResult, CommandContext } from "../types"
import { FileSystem } from "../core/FileSystem"
import { FileNode } from "../core/FileSystem"

export const vimCommand: Command = {
    name: "vim",
    description: "Open a file with Vim text editor",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem, commandContext: CommandContext, ): CommandResult => {
        const filename = args[0]!
        const file: FileNode | undefined = fileSystem.findFile(filename)

        if (!file) return {lines: ["Couldn't find file " + filename], isError: true}
        
        commandContext.openEditor(file)

        return {lines: []}
    }
}
