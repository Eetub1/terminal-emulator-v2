export class FileNode {
    
    public name: string

    constructor(name: string) {
        this.name = name
    }
}

export class DirectoryNode {
    
    public parent: DirectoryNode | null
    private childDirectories: DirectoryNode[]
    private files: FileNode[]
    private name: string
    private path: string
    
    constructor(parent: DirectoryNode | null, name: string) {
        this.parent = parent
        this.childDirectories = []
        this.files = []
        this.name = name
        this.path = parent ? `${parent.path}/${name}` : "~"
    }
    
    getChildDirectories(): DirectoryNode[] {
        return this.childDirectories
    }

    getName(): string {
        return this.name
    }

    getPath(): string {
        return this.path
    }

    createFile(filename: string): boolean {
        const doesExist = this.files.some(file => file.name === filename)
        if (doesExist) return false
        this.files.push(new FileNode(filename))
        return true
    }

    getFiles(): FileNode[] {
        return this.files
    }
}


export class FileSystem {

    private root: DirectoryNode
    private currentDirectory: DirectoryNode

    constructor() {
        this.root = new DirectoryNode(null, "~")
        this.currentDirectory = this.root
    }

    createFile(filename: string): boolean {
        return this.currentDirectory.createFile(filename)
    }

}