export class TerminalBuffer {
    private text = ""
    private cursorIndex = 0

    addCharacter(character: string): void {
        this.text = this.text.slice(0, this.cursorIndex) + character + this.text.slice(this.cursorIndex)
        this.cursorIndex++
    }

    deleteCharacter(): void {
        if (this.cursorIndex === 0) return
        this.text = this.text.slice(0, this.cursorIndex - 1) + this.text.slice(this.cursorIndex)
        this.cursorIndex--
    }

    moveCursorLeft(): void {
        if (this.cursorIndex > 0) this.cursorIndex--
    }

    moveCursorRight(): void {
        if (this.cursorIndex < this.text.length) this.cursorIndex++
    }

    getText(): string {
        return this.text
    }

    getCursorIndex(): number {
        return this.cursorIndex
    }

    clearBuffer(): void {
        this.text = ""
        this.cursorIndex = 0
    }
}