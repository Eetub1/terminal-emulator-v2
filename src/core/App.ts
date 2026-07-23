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
import { setupApp } from "../ui/setupApp"


import { FileNode } from "./FileSystem"

import { AppState } from "../types"
import { DocumentBuffer } from "./editor/DocumentBuffer"

const documentBuffer = new DocumentBuffer()
const editorTextBuffer = new TerminalBuffer()

export class App {
    private appState: AppState = AppState.Terminal
    private commandHandler: CommandHandler
    private fileSystem: FileSystem
    private vimEditor: VimEditor

    constructor(fileSystem: FileSystem, terminalBuffer: TerminalBuffer, output: Output,) {
        this.commandHandler = new CommandHandler(terminalBuffer, fileSystem, output, 
            (file: FileNode) => this.openEditor(file))
        this.vimEditor = new VimEditor(documentBuffer, editorTextBuffer, 
            (file, contents) => this.saveFile(file, contents))
        this.fileSystem = fileSystem
    }

    start(): void {
        setupApp() // add a few eventlisteners
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
                // Clear the commandsection
                updateEditorCommandSection(this.vimEditor.getCommandTextBuffer().getText(), this.vimEditor.getCommandTextBuffer().getCursorIndex())
            } else {
                renderEditorTextOnScreen(this.vimEditor.getDocumentBuffer().bufferToArray())
                setInfoSection(this.vimEditor.getEditorMode(), this.vimEditor.getCurrentFile())
                updateEditorCommandSection(this.vimEditor.getCommandTextBuffer().getText(), this.vimEditor.getCommandTextBuffer().getCursorIndex())
            }
        }
    }


    saveFile(file: FileNode, contents: string): void {
        this.fileSystem.writeFile(file, contents)
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