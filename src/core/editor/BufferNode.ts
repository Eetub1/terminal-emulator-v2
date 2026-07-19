import { RowGapBuffer } from "./RowGapBuffer.js"

export class BufferNode {

    public data: RowGapBuffer
    public prev: BufferNode | null
    public next: BufferNode | null

    constructor(initialContent: string = "") {
        this.prev = null
        this.next = null
        this.data = new RowGapBuffer(initialContent)
    }
}