import { TerminalBuffer } from "./terminal/TerminalBuffer"
import { FileSystem } from "./FileSystem"
import { Output } from "../ui/terminal/Output"
import { CommandParser } from "./CommandParser"
import { clearPrompt } from "../ui/terminal/prompt"

import { touchCommand } from "../commands/touch"
import { lsCommand } from "../commands/ls"
import { echoCommand } from "../commands/echo"
import { manCommand } from "../commands/man"

import type { Command, CommandResult } from "../types"
import type { ParsedCommand } from "../types"

export class CommandHandler {
    
    private history: string[]
    private commands: Map<string, Command>
    private terminalBuffer: TerminalBuffer
    private fileSystem: FileSystem
    private outputHandler: Output
    private parser: CommandParser
    
    constructor(terminalBuffer: TerminalBuffer, fileSystem: FileSystem, outputHandler: Output) {
        this.history = []
        this.commands = new Map()
        this.terminalBuffer = terminalBuffer
        this.fileSystem = fileSystem
        this.outputHandler = outputHandler
        this.parser = new CommandParser()
        this.setCommands()
    }


    handleCommand(input: string): void {
        const command: ParsedCommand = this.parser.parseCommand(input)
        if (command.name !== "") this.history.push(input)

        this.outputHandler.appendCommandToHistory(
            "user@emulator:" + this.fileSystem.getCurrentDirectoryName() + "$", 
            input) // adds command to screen history
        this.executeCommand(command)
    }


    executeCommand(command: ParsedCommand): void {
        const systemCommand: Command | undefined = this.commands.get(command.name)

        let commandOutput: CommandResult = {lines: [], isError: false}
        if (!systemCommand) {
            commandOutput = {lines: [`Couldn't find command ${command.name}`], isError: true}
        } else if (command.args.length < systemCommand.minArgs) {
            commandOutput = {lines: [`Not enough arguments given: ${command.args.length}`], isError: true}
        } else if (systemCommand.maxArgs !== null && command.args.length > systemCommand.maxArgs) {
            commandOutput = {lines: [`Too many arguments given: ${command.args.length}`], isError: true}
        } else {
            commandOutput = systemCommand.execute(command.args, this.fileSystem, this)
        }

        this.outputHandler.appendCommandOutputToHistory(commandOutput)
        clearPrompt()
    }


    getTerminalBuffer(): TerminalBuffer {
        return this.terminalBuffer
    }


    getCommands(): Map<string, Command>{
        return this.commands
    }


    setCommands(): void {
        this.commands.set(touchCommand.name, touchCommand)
        this.commands.set(lsCommand.name, lsCommand)
        this.commands.set(echoCommand.name, echoCommand)
        this.commands.set(manCommand.name, manCommand)
    }
}