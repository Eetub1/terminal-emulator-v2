import type { VimEditor } from "./VimEditor"

export const handleEditorInput = (event: KeyboardEvent, vimEditor: VimEditor): void => {
    console.log(event.key)
    console.log(vimEditor)
}