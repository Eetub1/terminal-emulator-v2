import { DocumentBuffer } from "./DocumentBuffer"
import { TerminalBuffer } from "../terminal/TerminalBuffer"
import { FileNode } from "../FileSystem"

import { VimMode } from "../../types"

export class VimEditor {
    private mode: VimMode
    private documentBuffer: DocumentBuffer
    private currentFile: FileNode | null
    private commandTextBuffer: TerminalBuffer // Contains the editor's terminal input

    constructor(documentBuffer: DocumentBuffer, commandTextBuffer: TerminalBuffer) {
        this.mode = VimMode.Normal
        this.documentBuffer = documentBuffer
        this.currentFile = null
        this.commandTextBuffer = commandTextBuffer
    }


    open(file: FileNode): void {
        this.setCurrentFile(file)
        
        this.documentBuffer.loadFromString(file.contents)
    }


    getDocumentBuffer(): DocumentBuffer {
        return this.documentBuffer
    }


    getCommandTextBuffer(): TerminalBuffer {
        return this.commandTextBuffer
    }


    getEditorMode(): VimMode {
        return this.mode
    }


    setEditorMode(mode: VimMode): void {
        this.mode = mode
    }

    
    setCurrentFile(file: FileNode | null): void {
        this.currentFile = file
    }


    getCurrentFile(): FileNode | null{
        return this.currentFile
    }


    handleEditorKeyPress(event: KeyboardEvent): string {
        const key = event.key
        console.log("Key pressed: ", key)

        switch (this.mode) {
            case VimMode.Normal:
                return this.handleNormalModePress(key)
            case VimMode.Insert:
                return this.handleInsertModePress(key)
            case VimMode.Command:
                return this.handleCommandModePress(key)
        }
    }


    handleNormalModePress(key: string): string {
        const currentRow = this.documentBuffer.getCurrentRow()!
        
        switch (key) {
            case "h":
                currentRow.moveCursorLeft()
                break
            case "l":
                currentRow.moveCursorRight()
                break
            case "j":
                this.documentBuffer.moveCursorDown()
                break
            case "k":
                this.documentBuffer.moveCursorUp()
                break
            case "ArrowLeft":
                currentRow.moveCursorLeft()
                break
            case "ArrowRight":
                currentRow.moveCursorRight()
                break
            case "ArrowUp":
                this.documentBuffer.moveCursorUp()
                break
            case "ArrowDown":
                this.documentBuffer.moveCursorDown()
                break
            case "i":
                this.mode = VimMode.Insert
                break
            case ":":
                this.mode = VimMode.Command
                this.commandTextBuffer.clearBuffer()
                this.commandTextBuffer.addCharacter(":")
                break
            default:
                break
        }
        return ""
    }


    handleInsertModePress(key: string): string {
        const currentRow = this.documentBuffer.getCurrentRow()!

        switch (key) {
            case "Escape":
                this.mode = VimMode.Normal
                break
            case "Backspace":
            {
                const gapStartIndex = currentRow.getGapStart()
                const contentLength = currentRow.getContentLength()
                if (gapStartIndex <= 0 && contentLength === 0) {
                    this.documentBuffer.deleteRow()
                } else {
                    currentRow.deleteChar()
                }
                break
            }
            case "ArrowLeft":
                currentRow.moveCursorLeft()
                break
            case "ArrowRight":
                currentRow.moveCursorRight()
                break
            case "ArrowUp":
                this.documentBuffer.moveCursorUp()
                break
            case "ArrowDown":
                this.documentBuffer.moveCursorDown()
                break
            case "Enter":
                this.documentBuffer.addNewRow()
                break
            default:
                if (key.length === 1) {
                    currentRow.insertChar(key)
                }
                break
        }
        return ""
    }


    handleCommandModePress(key: string): string {
        switch (key) {
            case "Backspace":
                if (this.commandTextBuffer.getText().length == 1) {
                    this.commandTextBuffer.deleteCharacter()
                    this.mode = VimMode.Normal
                    return ""
                }
                this.commandTextBuffer.deleteCharacter()
                break
            case "Enter":
                return this.handleCommand(this.commandTextBuffer.getText())
            case "Escape":
                this.commandTextBuffer.clearBuffer()
                this.mode = VimMode.Normal
                break
            case "ArrowRight":
                this.commandTextBuffer.moveCursorRight()
                break
            case "ArrowLeft":
                this.commandTextBuffer.moveCursorLeft()
                break
            default:
                if (key.length === 1) {
                    this.commandTextBuffer.addCharacter(key)
                }
        }
        return ""
    }


    handleCommand(command: string): string {
        const pureCommand = command.slice(1).trim()
        console.log(pureCommand)

        this.commandTextBuffer.clearBuffer()
        this.mode = VimMode.Normal

        switch (pureCommand) {
            case "q":
                return "exit"
            case "w":
                this.getCurrentFile()!.setContents(this.documentBuffer.bufferToString())
                break
            case "wq":
                this.handleCommand(":w")
                return this.handleCommand(":q")
            default:
                break
        }
        return ""
    }
}