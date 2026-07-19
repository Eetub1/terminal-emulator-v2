/*This file represents a whole textfile. Each buffernode is a row in the file*/

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


    /*addNewRow(initialContent: string = ""): void {
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
    }*/


    /**
     * Inserts a new row after the cursor row and moves the cursor onto it
     */
    addNewRow(initialContent: string = ""): void {
        const node = new BufferNode(initialContent)

        node.prev = this.cursor
        node.next = this.cursor!.next

        if (this.cursor!.next) {
            this.cursor!.next.prev = node
        } else {
            this.last = node
        }
        this.cursor!.next = node
        this.cursor = node
    }


    /**
     * Deletes the cursor row
     * Cursor moves to the next row, or the previous one if the last row
     * was deleted. Deleting the only row just empties it.
     */
    deleteRow(): void {
        if (this.first === this.last) {
            // vim clears the final line
            const empty = new BufferNode()
            this.first = empty
            this.last = empty
            this.cursor = empty
            return
        }

        const { prev, next } = this.cursor!

        if (prev) prev.next = next
        else this.first = next!

        if (next) next.prev = prev
        else this.last = prev!

        this.cursor = next ?? prev!
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


    /**
     * Sets the documentbuffer with the file contents
     * @param file 
     */
    loadFromString(file: string) {
        this.clearBuffer()
        const lines = file.split("\n")

        let lastNode = null
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const node = new BufferNode(line)
        
            if (i == 0) {
                this.first = node
                this.cursor = node
            }

            if (i == lines.length - 1) {
                this.last = node
            }

            if (lastNode) {
                lastNode.next = node
                node.prev = lastNode
            }

            lastNode = node
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
        const lines: string[] = []
        let curr = this.first
        while (curr) {
            lines.push(curr.data.toString())
            curr = curr.next
        }
        return lines.join("\n")
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