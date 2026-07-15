import { AppState, type Command, type CommandResult } from "../types"
import { clearPrompt } from "../ui/terminal/prompt"
// import { renderDefaultVimView, renderEditorTextOnScreen } from "../ui/editor/vimUI"
import { FileSystem } from "../core/FileSystem"
import { CommandHandler } from "../core/CommandHandler"

import { FileNode } from "../core/FileSystem"
// import type { DocumentRow } from "../types"

export const vimCommand: Command = {
    name: "vim",
    description: "Open a file with Vim text editor",
    minArgs: 1,
    maxArgs: 1,
    execute: (args: string[], fileSystem: FileSystem, commandHandler?: CommandHandler): CommandResult => {
        const filename = args[0]!
        const file: FileNode | undefined = fileSystem.findFile(filename)

        if (!file) return {lines: ["Couldn't find file " + filename], isError: true}
        
        commandHandler!.setApplicationState(AppState.Editor)
        commandHandler!.setCurrentFile(file)
        clearPrompt()

        // const fileContents: DocumentRow[] = file.getContents()
        // const fileContents: string = file.getContents()

        // renderDefaultVimView(file)
        // renderEditorTextOnScreen(fileContents)

        return {lines: []}
    }
}
