import { CommandHandler } from "./CommandHandler"
import { VimEditor } from "./editor/VimEditor"
import { TerminalBuffer } from "./terminal/TerminalBuffer"
import { FileSystem } from "./FileSystem"
import { Output } from "../ui/terminal/Output"
import { handleTerminalInput } from "./terminal/handleTerminalInput"

import { renderDefaultTerminalScreen } from "../ui/terminal/prompt"
import { renderDefaultVimView } from "../ui/editor/vimUI"
import { renderEditorTextOnScreen } from "../ui/editor/vimUI"
import { setInfoSection } from "../ui/editor/vimUI"
import { updateEditorCommandSection } from "../ui/editor/editorTerminal"


import { FileNode } from "./FileSystem"

import { AppState } from "../types"

export class App {
    private appState: AppState = AppState.Terminal
    private commandHandler: CommandHandler
    private fileSystem: FileSystem
    //private terminalBuffer: TerminalBuffer
    private vimEditor: VimEditor
    //private output: Output

    constructor(fileSystem: FileSystem, terminalBuffer: TerminalBuffer, vimEditor: VimEditor, output: Output,) {
        this.commandHandler = new CommandHandler(terminalBuffer, fileSystem, output, (file: FileNode) => this.openEditor(file))
        this.vimEditor = vimEditor
        this.fileSystem = fileSystem
        //this.terminalBuffer = terminalBuffer
        //this.output = output
    }

    start(): void {
        renderDefaultTerminalScreen(this.fileSystem.getPath())
    }

    handleKey(event: KeyboardEvent): void {
        if (event.key === "Tab" || event.key === " ") {
            event.preventDefault()
        }

        if (this.appState === AppState.Terminal) {
            handleTerminalInput(event, this.commandHandler)
        } else {
            const result = this.vimEditor.handleEditorKeyPress(event)
            if (result === "exit") {
                this.exitEditor()
            } else {
                renderEditorTextOnScreen(this.vimEditor.getDocumentBuffer().bufferToArray())
                setInfoSection(this.vimEditor.getEditorMode(), this.vimEditor.getCurrentFile())
                updateEditorCommandSection(this.vimEditor.getCommandTextBuffer().getText(), this.vimEditor.getCommandTextBuffer().getCursorIndex())
            }
        }
    }


    exitEditor() {
        this.appState = AppState.Terminal
        this.vimEditor.setCurrentFile(null)
        this.vimEditor.getCommandTextBuffer().clearBuffer()
        renderDefaultTerminalScreen(this.fileSystem.getPath())
    }


    openEditor(file: FileNode): void {
        this.appState = AppState.Editor
        this.vimEditor.open(file)

        renderDefaultVimView(file)
        renderEditorTextOnScreen(this.vimEditor.getDocumentBuffer().bufferToArray())
    }
}