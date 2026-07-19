import { DirectoryNode, FileSystem, FileNode } from "./core/FileSystem"
import { RowGapBuffer } from "./core/editor/RowGapBuffer"


export enum AppState {
    Terminal = "terminal",
    Editor = "editor",
}

export enum VimMode {
    Normal = "NORMAL",
    Insert = "INSERT",
    Command = "COMMAND"
}

export type DocumentRow = {
    data: RowGapBuffer,
    hasCursor: boolean
}

export type CommandResult = {
    lines: string[]
    isError?: boolean
}

export type ParsedCommand = {
    name: string
    args: string[]
}

export type PathResult = {
    exists: boolean
    directory: DirectoryNode | null
}

export type DeleteDirectoryResultObject = {
    wasSuccess: boolean
    message: string
}

export type CommandContext = {
    openEditor: (file: FileNode) => void
    findCommand: (name: string) => Command | undefined
}

export type Command = {
    name: string
    description: string
    minArgs: number
    maxArgs: number | null // null if there can be as many arguments as you want
    execute: (
        args: string[], 
        fileSystem: FileSystem,
        commandContext: CommandContext
    ) => CommandResult
}

export type SerializedFileNode = {
    name: string
    contents: string
}

// Version of DirectoryNode object without the parent field, because that caused a circular structure
export type SerializedDirectory = {
    name: string
    files: SerializedFileNode[]
    childDirectories: SerializedDirectory[]
}