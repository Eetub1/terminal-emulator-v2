export const setupApp = () => {
    const terminalHelpSection = document.getElementById("terminalHelpSection")
    document.getElementById("hideTerminalHelpSectionButton")?.addEventListener("click", function() {
        localStorage.setItem("hideTerminalHelp", "true")
        terminalHelpSection?.classList.add("hidden")
    })

    const editorHelpSection = document.getElementById("editorHelpSection")
    document.getElementById("hideEditorHelpSectionButton")?.addEventListener("click", function() {
        localStorage.setItem("hideEditorHelp", "true")
        editorHelpSection?.classList.add("hidden")
    })
}