import { PROMPT_SYMBOL } from "../../utils/symbols.js"
import type { TerminalCharacter } from "../../types.js"

/**
 * Renders a default prompt on screen
 */
export const renderDefaultPrompt = (): void => {
    // Make sure terminal is visible
    const terminalViewContainer = document.getElementById("terminalView")!
    terminalViewContainer.style.display = "block"

    // Hide editor
    const editorViewContainer = document.getElementById("editorView")!
    editorViewContainer.classList.add("hidden")
    editorViewContainer.classList.remove("editorViewVisible")

    // Build the prompt from scratch
    const terminalContainer = document.getElementById("terminal") as HTMLElement
    terminalContainer.textContent = ""

    const p = document.createElement("p")
    p.className = "prompt"
    p.textContent = "user@emulator:~$ "
    terminalContainer.appendChild(p)

    const promptInput = document.createElement("div")
    promptInput.className = "promptInput"
    terminalContainer.appendChild(promptInput)

    const cursor = document.createElement("span")
    cursor.className = "cursor"
    cursor.textContent = PROMPT_SYMBOL
    promptInput.appendChild(cursor)
}


/**
 * Handles drawing what ever the user types on screen. The drawing is based
 * on what the doubly linked list buffer contains
 * @param characters 
 */
export const renderUserInputOnScreen = (characters: TerminalCharacter[]): void => {
    const promptInput = document.querySelector(".promptInput")!
    promptInput.textContent = ""

    let isCursorTopOfText = false
    for (const char of characters) {
        const span = document.createElement("span")
        span.textContent = char.data

        if (char.hasCursor) {
            span.classList.add("cursor")
            isCursorTopOfText = true
        }
        promptInput.appendChild(span)
    }

    if (!isCursorTopOfText) {
        const cursor = document.createElement("span")
        cursor.className = "cursor"
        cursor.textContent = PROMPT_SYMBOL
        promptInput.appendChild(cursor)
    }
}