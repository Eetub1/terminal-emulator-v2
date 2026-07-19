import { DocumentBuffer } from "./DocumentBuffer"
import { TerminalBuffer } from "../terminal/TerminalBuffer"
import { FileNode } from "../FileSystem"

import { renderDefaultVimView } from "../../ui/editor/vimUI"
import { renderEditorTextOnScreen } from "../../ui/editor/vimUI"

import { VimMode } from "../../types"

export class VimEditor {
    private mode: VimMode
    private documentBuffer: DocumentBuffer
    private currentFile: FileNode | null
    private commandTextBuffer: TerminalBuffer

    constructor(documentBuffer: DocumentBuffer) {
        this.mode = VimMode.Normal
        this.documentBuffer = documentBuffer
        this.currentFile = null
        this.commandTextBuffer = new TerminalBuffer()
    }

    open(file: FileNode): void {
        this.setCurrentFile(file)
        renderDefaultVimView(file)
        renderEditorTextOnScreen(file.getContents())
    }


    getDocumentBuffer(): DocumentBuffer {
        return this.documentBuffer
    }


    getEditorMode(): string {
        return this.mode
    }


    setEditorMode(mode: VimMode): void {
        this.mode = mode
    }

    
    setCurrentFile(file: FileNode): void {
        this.currentFile = file
    }


    getCurrentFile(): FileNode | null{
        return this.currentFile
    }


    handleEditorKeyPress(event: KeyboardEvent): void {
        const key = event.key
        console.log("Key pressed: ", key)
        return

        switch (this.mode) {
            case VimMode.Normal:
                this.handleNormalModePress(key)
                break
            case VimMode.Insert:
                this.handleInsertModePress(key)
                break
            case VimMode.Command:
                this.handleCommandModePress(key)
                break
        }
    }
}