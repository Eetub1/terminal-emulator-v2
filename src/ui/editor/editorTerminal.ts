import { PROMPT_SYMBOL } from "../../utils/symbols.js"

/**
 * Draws user input to the editor commandline
 * THIS IS BASICALLY THE SAME AS RENDERUSERINPUTONSCREEN IN PROMPT.TS MAYBE REFACTOR???
 */
export const updateEditorCommandSection = (text: string, cursorIndex: number): void => {
    if (text == "") {
        clearEditorCommandInput()
        return
    }

    const commandSection = document.getElementById("editorCommandSection")!
    commandSection.textContent = ""

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement("span")
        span.textContent = char

        if (i === cursorIndex) {span.classList.add("cursor")}
        commandSection.appendChild(span)
    }

    // Check if the cursor is right after all of the text
    if (cursorIndex === text.length) {
        const cursor = document.createElement("span")
        cursor.className = "cursor"
        cursor.textContent = PROMPT_SYMBOL
        commandSection.appendChild(cursor)
    }

    // When the terminal input overflows, the view keeps scrolling so that recent input is visible
    document.querySelector(".cursor")?.scrollIntoView({ block: "nearest", inline: "nearest" })
}


export const clearEditorCommandInput = (): void => {
    const editorCommandSection = document.getElementById("editorCommandSection")!
    editorCommandSection.textContent = ""
}