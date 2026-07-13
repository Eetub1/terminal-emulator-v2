export class Output {

    private history: string[]

    constructor() {
        this.history = []
    }


    getHistory(): string[] {
        return this.history
    }
}