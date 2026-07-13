import { PROMPT_SYMBOL } from "../../utils/symbols"

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

    // Build the whole prompt from scratch
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
 * @param text
 */
export const renderUserInputOnScreen = (text: string, cursorIndex: number): void => {
    const promptInput = document.querySelector(".promptInput")!
    promptInput.textContent = ""

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement("span")
        span.textContent = char

        if (i === cursorIndex) {span.classList.add("cursor")}
        promptInput.appendChild(span)
    }

    // Check if the cursor is right after all of the text
    if (cursorIndex === text.length) {
        const cursor = document.createElement("span")
        cursor.className = "cursor"
        cursor.textContent = PROMPT_SYMBOL
        promptInput.appendChild(cursor)
    }

    // When the terminal input overflows, the view keeps scrolling so that recent input is visible
    document.querySelector(".cursor")?.scrollIntoView({ block: "nearest", inline: "nearest" })
}


/**
 * Clears the prompt of user input. Also updates the path 
 */
export const clearPrompt = (): void => {
    const promptInput = document.querySelector(".promptInput")!
    const spans = promptInput.querySelectorAll("span")

    for (let i = 0; i < spans.length - 1; i++) {
        spans[i]?.remove()
    }
}


export const renderPromptPath = (curPath: string): void => {
    document.querySelector(".prompt")!.textContent = `user@emulator:${curPath}$ `
}