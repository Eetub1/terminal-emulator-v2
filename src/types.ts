// Object that represent a single character in terminal
// Data is what character this node contains. HasCursor tells if the cursor
// is on top of this node
export type TerminalCharacter = {
    data: string
    hasCursor: boolean
}