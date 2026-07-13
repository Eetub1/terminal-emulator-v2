import { FileSystem } from "./core/FileSystem"
import { CommandHandler } from "./core/CommandHandler"

export type CommandResult = {
    lines: string[]
    isError?: boolean
}

export type ParsedCommand = {
    name: string
    args: string[]
}

export type Command = {
    name: string
    description: string
    minArgs: number
    maxArgs: number | null // null if there can be as many arguments as you want
    execute: (
        args: string[], 
        fileSystem: FileSystem,
        commandHandler?: CommandHandler
    ) => CommandResult
}