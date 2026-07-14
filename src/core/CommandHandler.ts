import { TerminalBuffer } from "./terminal/TerminalBuffer"
import { FileSystem } from "./FileSystem"
import { Output } from "../ui/terminal/Output"
import { CommandParser } from "./CommandParser"
import { renderUserInputOnScreen, renderPromptPath } from "../ui/terminal/prompt"

import { touchCommand } from "../commands/touch"
import { lsCommand } from "../commands/ls"
import { echoCommand } from "../commands/echo"
import { manCommand } from "../commands/man"
import { mkdirCommand } from "../commands/mkdir"
import { pwdCommand } from "../commands/pwd"
import { cdCommand } from "../commands/cd"
import { rmCommand } from "../commands/rm"
import { rmdirCommand } from "../commands/rmdir"

import type { Command, CommandResult, ParsedCommand } from "../types"
import { AppState } from "../types"

export class CommandHandler {
    
    private history: string[]
    private commands: Map<string, Command>
    private terminalBuffer: TerminalBuffer
    private fileSystem: FileSystem
    private outputHandler: Output
    private parser: CommandParser
    private applicationState: AppState
    private prevCommandIndex: number
    
    constructor(terminalBuffer: TerminalBuffer, fileSystem: FileSystem, outputHandler: Output) {
        this.history = []
        this.commands = new Map()
        this.terminalBuffer = terminalBuffer
        this.fileSystem = fileSystem
        this.outputHandler = outputHandler
        this.parser = new CommandParser()
        this.setCommands()
        this.applicationState = AppState.Terminal
        this.prevCommandIndex = -1
    }


    handleCommand(input: string): void {
        const command: ParsedCommand = this.parser.parseCommand(input)
        if (command.name !== "") this.history.push(input)

        // adds command to screen history
        this.outputHandler.appendCommandToHistory(this.fileSystem.getPath(), input)
        this.executeCommand(command)
    }


    executeCommand(command: ParsedCommand): void {
        const systemCommand: Command | undefined = this.commands.get(command.name)

        let commandOutput: CommandResult
        if (!systemCommand) {
            commandOutput = {lines: [`Couldn't find command ${command.name}`], isError: true}
        } else if (command.args.length < systemCommand.minArgs) {
            commandOutput = {lines: [`Not enough arguments given: ${command.args.length}, expected at least: ${systemCommand.minArgs}`], isError: true}
        } else if (systemCommand.maxArgs !== null && command.args.length > systemCommand.maxArgs) {
            commandOutput = {lines: [`Too many arguments given: ${command.args.length}, expected at most: ${systemCommand.maxArgs}`], isError: true}
        } else {
            commandOutput = systemCommand.execute(command.args, this.fileSystem, this)
        }

        this.outputHandler.appendCommandOutputToHistory(commandOutput)
        this.terminalBuffer.clearBuffer()
        renderUserInputOnScreen(this.terminalBuffer.getText(), this.terminalBuffer.getCursorIndex())
        renderPromptPath(this.fileSystem.getPath())
    }


    previousCommand(): void {
        if (this.history.length === 0) return

        if (this.prevCommandIndex === -1) {
            this.prevCommandIndex = this.history.length - 1
        }

        const prevCommand = this.history[this.prevCommandIndex]!
        this.prevCommandIndex -= 1

        this.terminalBuffer.clearBuffer()
        for (const char of prevCommand) {
            this.terminalBuffer.addCharacter(char)
        }
    }


    /**
     * Autocomplete is casesensitive
     */
    handleInputAutocomplete(): void {
        const terminalInput: string = this.terminalBuffer.getText()
        if (terminalInput.trim() === "") return

        const currDirContents: string[] = this.fileSystem.getCurrentDirectory().getChildDirectoriesAndFiles()
        const parts: string[] = terminalInput.split(" ")
        const lastWord: string = parts[parts.length - 1]!
        const possibleMatches: string[] = currDirContents.filter(name => name.startsWith(lastWord))
        
        if (possibleMatches.length === 1) {
            const buffer = this.getTerminalBuffer()
            buffer.clearBuffer()

            parts.pop()
            parts.push(possibleMatches[0]!)
            
            for (const char of parts.join(" ")) {
                buffer.addCharacter(char)
            }
            return
        }

        if (possibleMatches.length > 1) {
            this.outputHandler.handleAutocompleteOutput(this.fileSystem.getPath(), possibleMatches, terminalInput)
        }
        // else 0 possible matches, do nothing
    }


    getTerminalBuffer(): TerminalBuffer {
        return this.terminalBuffer
    }


    getCommands(): Map<string, Command>{
        return this.commands
    }


    getApplicationState(): AppState {
        return this.applicationState
    }


    setCommands(): void {
        this.commands.set(touchCommand.name, touchCommand)
        this.commands.set(lsCommand.name, lsCommand)
        this.commands.set(echoCommand.name, echoCommand)
        this.commands.set(manCommand.name, manCommand)
        this.commands.set(mkdirCommand.name, mkdirCommand)
        this.commands.set(pwdCommand.name, pwdCommand)
        this.commands.set(cdCommand.name, cdCommand)
        this.commands.set(rmCommand.name, rmCommand)
        this.commands.set(rmdirCommand.name, rmdirCommand)
    }
}