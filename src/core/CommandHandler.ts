import { TerminalBuffer } from "./terminal/TerminalBuffer.js"

export class CommandHandler {
    
    private terminalBuffer: TerminalBuffer
    
    constructor(terminalBuffer: TerminalBuffer) {
        this.terminalBuffer = terminalBuffer
    }


    getTerminalBuffer(): TerminalBuffer {
        return this.terminalBuffer
    }
}