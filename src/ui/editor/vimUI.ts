import { FileNode } from "../../core/FileSystem"
import { VimMode } from "../../types"

import type { DocumentRow } from "../../types"
import { PROMPT_SYMBOL } from "../../utils/symbols"

export const renderDefaultVimView = (currentFile: FileNode | null = null): void => {
    // Hide terminal
    const terminalViewContainer = document.getElementById("terminalView")!
    terminalViewContainer.style.display = "none"

    // Show editor
    const editorViewContainer = document.getElementById("editorView")!
    editorViewContainer.classList.remove("hidden")
    editorViewContainer.classList.add("editorViewVisible")

    setInfoSection(VimMode.Normal, currentFile)
}


export const renderEditorTextOnScreen = (fileContents: DocumentRow[]): void => {
    const editorContainer = document.getElementById("editorTextSection")!
    editorContainer.textContent = ""

    let i = 1
    for (const row of fileContents) {
        const rowElement = document.createElement("div")
        rowElement.classList.add("editorRow")

        const rowNumSpan = document.createElement("span")
        rowNumSpan.classList.add("editorRowNumberContainer")
        rowNumSpan.textContent = "" + i + " | "
        rowElement.appendChild(rowNumSpan)

        const rowText: string = row.data.toString()

        if (!row.hasCursor) {
            if (!rowText) {
                const span = document.createElement("span")
                span.textContent = ""
                rowElement.appendChild(span)
            } else {
                for (const char of rowText) {
                    const span = document.createElement("span")
                    span.textContent = char
                    rowElement.appendChild(span)
                }
            }
        } else {
            const cursorIndex = row.data.getCursorIndex()
            
            for (let i = 0; i < rowText.length; i++) {
                const span = document.createElement("span")

                if (i === cursorIndex) {
                    span.classList.add("cursor")
                }

                span.textContent = rowText[i]!
                rowElement.appendChild(span)
            }

            if (cursorIndex === rowText.length) { // if cursor was not on top of text
                const cursorSpan = document.createElement("span")
                cursorSpan.classList.add("cursor")
                cursorSpan.textContent = PROMPT_SYMBOL
                rowElement.appendChild(cursorSpan)
            }

        }
        editorContainer.appendChild(rowElement)
        i += 1
    }
}


export const setInfoSection = (mode: VimMode, currentFile: FileNode | null = null): void => {
    const infoSection = document.getElementById("editorSessionInfoSection")!
    infoSection.textContent = "Mode: " + mode.toUpperCase()
    
    if (currentFile) {
        infoSection.textContent += " | File: " + currentFile.name
    }
}