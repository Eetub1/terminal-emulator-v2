import { PROMPT_SYMBOL } from "../../utils/symbols"

export class Output {

    private history: string[]

    constructor() {
        this.history = []
    }


    getHistory(): string[] {
        return this.history
    }
}