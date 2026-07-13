import type { TerminalCharacter } from "../../types"

// Represents a single character
class BufferNode {

    public data: string
    public prev: BufferNode | null
    public next: BufferNode | null

    constructor(character: string) {
        this.prev = null
        this.next = null
        this.data = character
    }
}


// Represents all of the input in the terminal. This class is a doubly linked list
// so that moving from a node to its previous or following node is fast.
export class TerminalBuffer {

    private first: BufferNode | null
    private last: BufferNode | null
    private cursor: BufferNode | null // what is the location of the cursor

    constructor() {
        this.first = null
        this.last = null
        this.cursor = null // if this is null, then cursor is right after all the text
    }


    addCharacter(character: string): void {
        const newNode = new BufferNode(character)

        if (!this.first) { // we are adding the first node of the list
            this.first = newNode
            this.last = newNode
        } else { 
            if (!this.cursor) { // we are adding to the very end
                const prevLastNode = this.last!
                prevLastNode.next = newNode
                newNode.prev = prevLastNode
                this.last = newNode
            } else { // there are 2 cases, either we are on top of the first char or not
                if (this.cursor === this.first) { // we are on the first character of the input
                    newNode.next = this.cursor
                    this.cursor.prev = newNode
                    this.first = newNode
                } else { // we are not on the first char but on top of some other char
                    const prevNode = this.cursor.prev!
                    prevNode.next = newNode
                    newNode.prev = prevNode
                    this.cursor.prev = newNode
                    newNode.next = this.cursor
                }
            }
        }
    }


    deleteCharacter(): void {
        if (!this.first) return

        if (!this.cursor) { // we are not on top of any char so we delete from the end
            if (!this.last!.prev) { // only a single char
                this.first = null
                this.last = null
            } else { // list has atleast 2 chars
                const prev = this.last!.prev
                this.last!.prev = null
                prev.next = null
                this.last = prev
            }
        } else { // we are on top of a char
            if (this.cursor === this.first) { // on top of the first char
                return
            } else { // not on top of the first one
                if (this.cursor.prev === this.first) { // we are on top of the second node so we are deleting the first
                    this.first.next = null
                    this.first = this.cursor
                    this.cursor.prev = null
                } else { // three nodes or more
                    const prevPrevNode = this.cursor.prev!.prev!
                    const prevNode = this.cursor.prev!
                    prevNode.next = null
                    prevNode.prev = null
                    prevPrevNode.next = this.cursor
                    this.cursor.prev = prevPrevNode
                }
            }
        }
    }


    moveCursorLeft(): void {
        if (!this.first) return
        
        if (!this.cursor) { // cursor is at the end
            this.cursor = this.last
        } else {
            if (this.cursor.prev) {
                this.cursor = this.cursor.prev
            }
        }
    }


    moveCursorRight(): void {
        if (!this.first) return
        if (!this.cursor) return // if we are at the end, do nothing

        if (this.cursor.next) {
            this.cursor = this.cursor.next
        } else {
            this.cursor = null
        }
    }


    //Construct an array of objects of every single character in the buffer
    bufferToArray(): TerminalCharacter[] {
        const charArray: TerminalCharacter[] = []
        let curr = this.first
        while (curr) {
            charArray.push({
                data: curr.data,
                hasCursor: this.cursor === curr
            })
            curr = curr.next
        }
        return charArray
    }


    // Turn the contents of the buffer into a string
    bufferToString(): string {
        let userInput = ""
        let curr = this.first
        while (curr) {
            userInput += curr.data
            curr = curr.next
        }
        return userInput
    }

    
    // Clear the contents of the buffer completely
    clearBuffer(): void {
        this.first = null
        this.last = null
        this.cursor = null
    }
}