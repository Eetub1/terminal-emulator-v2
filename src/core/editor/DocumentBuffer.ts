import { RowGapBuffer } from "./RowGapBuffer.js"
import { BufferNode } from "./BufferNode.js"
import type { DocumentRow } from "../../types.js"

export class DocumentBuffer {

    private first: BufferNode | null
    private last: BufferNode | null
    private cursor: BufferNode | null

    constructor() {
        const initialRow = new BufferNode()
        this.first = initialRow
        this.last = initialRow
        this.cursor = initialRow
    }


    addNewRow(initialContent: string = ""): void {
        const newNode = new BufferNode(initialContent)

        if (!this.first) { // we are adding the first node of the list
            this.first = newNode
            this.last = newNode
            this.cursor = newNode
        } else { 
            if (!this.cursor) { // we are adding to the very end
                const prevLastNode = this.last!
                prevLastNode.next = newNode
                newNode.prev = prevLastNode
                this.last = newNode
                this.cursor = newNode
            } else { // there are 2 cases, either we are on top of the first char or not
                if (this.cursor === this.first) { // we are on the first character of the input
                    const nextNode = this.cursor.next
                    this.cursor.next = newNode
                    newNode.prev = this.cursor

                    if (nextNode === null) {
                        this.last = newNode
                    } else {
                        newNode.next = nextNode
                        nextNode.prev = newNode
                    }
                    this.cursor = newNode

                } else { // we are not on the first char but on top of some other char
                    const nextNode = this.cursor.next
                    this.cursor.next = newNode
                    newNode.prev = this.cursor
                    
                    if (nextNode === null) {
                        this.last = newNode
                    } else {
                        newNode.next = nextNode
                        nextNode.prev = newNode
                    }
                    this.cursor = newNode
                }
            }
        }
    }


    deleteRow(): void {
        if (!this.first) return // this shouldn't be possible
        if (!this.cursor) return
        if (this.first === this.cursor) return // we are on the first row
        if(this.first === this.last) return // if we only have one, don't delete

        if (this.cursor === this.last) { // we are deleting the last row
            const prevNode = this.last.prev!
            prevNode.next = null
            this.last.prev = null
            this.last = prevNode
            this.cursor = prevNode
            return
        }

        // we are deleting from middle so there are atleast 3 rows currently
        const prevNode = this.cursor.prev!
        const nextNode = this.cursor.next!
        this.cursor = prevNode
        prevNode.next = nextNode
        nextNode.prev = prevNode
    }


    moveCursorUp(): void {
        if (!this.first) return
        
        if (!this.cursor) { // cursor is at the end
            this.cursor = this.last
        } else {
            if (this.cursor.prev) {
                this.cursor = this.cursor.prev
            }
        }
    }


    moveCursorDown(): void {
        if (!this.first) return
        if (!this.cursor) return // if we are at the end, do nothing

        if (this.cursor.next) {
            this.cursor = this.cursor.next
        } 
    }


    bufferToArray(): DocumentRow[] {
        const rowArray: DocumentRow[] = []
        let curr = this.first
        while (curr) {
            rowArray.push({
                data: curr.data,
                hasCursor: this.cursor === curr
            })
            curr = curr.next
        }
        return rowArray
    }


    bufferToString(): string {
        let userInput = ""
        let curr = this.first
        while (curr) {
            userInput += curr.data.toString() + "\n"
            curr = curr.next
        }
        return userInput
    }


    getCurrentRow(): RowGapBuffer | null {
        return this.cursor ? this.cursor.data : null
    }

    
    clearBuffer(): void {
        this.first = null
        this.last = null
        this.cursor = null
    }
}