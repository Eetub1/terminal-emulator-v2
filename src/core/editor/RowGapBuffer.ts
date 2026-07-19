export class RowGapBuffer {

    private buffer: string[]
    private gapStart: number
    private gapEnd: number 
    private capacity: number

    constructor(initialContent: string = "", initialCapacity: number = 128) {
        this.capacity = Math.max(initialCapacity, initialContent.length + 10)
        this.buffer = new Array(this.capacity).fill("")
        
        this.gapStart = 0
        this.gapEnd = this.capacity - 1

        for (const char of initialContent) {
            this.insertChar(char)
        }
    }


    getContentLength(): number {
        return this.toString().length
    }


    getCursorIndex(): number {
        return this.gapStart
    }


    getGapStart(): number {
        return this.gapStart
    }


    // Adds a character to cursor location
    insertChar(char: string): void {
        if (this.gapStart === this.gapEnd) {
            this.growBuffer()
        }

        this.buffer[this.gapStart] = char
        this.gapStart++
    }


    // Deletes a character from the left of a cursor
    deleteChar(): void {
        if (this.gapStart > 0) {
            this.gapStart--
            this.buffer[this.gapStart] = ""
        }
    }


    moveCursorLeft(): void {
        if (this.gapStart > 0) {
            this.gapStart--
            this.gapEnd--
            this.buffer[this.gapEnd + 1] = this.buffer[this.gapStart]!
            this.buffer[this.gapStart] = ""
        }
    }


    moveCursorRight(): void {
        if (this.gapEnd < this.capacity - 1) {
            this.gapStart++
            this.gapEnd++
            this.buffer[this.gapStart - 1] = this.buffer[this.gapEnd]!
            this.buffer[this.gapEnd] = ""
        }
    }


    // Transform buffer contents into a string
    toString(): string {
        const left = this.buffer.slice(0, this.gapStart).join("")
        const right = this.buffer.slice(this.gapEnd + 1).join("")
        return left + right
    }

    
    // Grow the buffer by times two
    growBuffer(): void {
        const oldCapacity = this.capacity
        this.capacity *= 2
        
        const newBuffer = new Array(this.capacity).fill("")
        
        // copy left side
        for (let i = 0; i < this.gapStart; i++) {
            newBuffer[i] = this.buffer[i]
        }

        // we calculate a new gap end and copy the right side
        const rightPartLength = oldCapacity - 1 - this.gapEnd
        const newGapEnd = this.capacity - 1 - rightPartLength

        for (let i = 0; i < rightPartLength; i++) {
            newBuffer[newGapEnd + 1 + i] = this.buffer[oldCapacity - rightPartLength + i]
        }

        this.gapEnd = newGapEnd
        this.buffer = newBuffer
    }
}