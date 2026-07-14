import type { PathResult, DeleteDirectoryResultObject } from "../types"

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
    public name: string
    
    constructor(parent: DirectoryNode | null, name: string) {
        this.parent = parent
        this.childDirectories = []
        this.files = []
        this.name = name
    }
    

    getChildDirectoriesAndFiles(): string[] {
        const list: string[] = []
        this.childDirectories.forEach(dir => list.push(dir.name))
        this.files.forEach(file => list.push(file.name))
        return list
    }


    getChildDirectories(): DirectoryNode[] {
        return this.childDirectories
    }


    getName(): string {
        return this.name
    }


    getPath(): string {
        return this.parent ? `${this.parent.getPath()}/${this.name}` : "~"
    }


    getFiles(): FileNode[] {
        return this.files
    }


    findChildDirectory(name: string): DirectoryNode | undefined {
        const result = this.childDirectories.find(dir => dir.name === name)
        return result
    }


    createDirectory(name: string): boolean {
        const exists = this.childDirectories.some(dir => dir.name === name)
    
        if (exists) return false
        
        const newDir = new DirectoryNode(this, name)
        this.childDirectories.push(newDir)
        return true
    }


    createFile(filename: string): boolean {
        const doesExist = this.files.some(file => file.name === filename)
        if (doesExist) return false
        this.files.push(new FileNode(filename))
        return true
    }


    deleteFile(filename: string): boolean {
        const initialLength = this.files.length
        this.files = this.files.filter(file => file.name !== filename)
        return this.files.length < initialLength
    }


    deleteDirectory(dirName: string): void {
        this.childDirectories = this.childDirectories.filter(dir => dir.name !== dirName)
    }
}


export class FileSystem {

    private root: DirectoryNode
    private currentDirectory: DirectoryNode

    constructor() {
        this.root = new DirectoryNode(null, "~")
        this.currentDirectory = this.root
    }


    getCurrentDirectory(): DirectoryNode {
        return this.currentDirectory
    }


    getPath(): string {
        return this.currentDirectory.getPath()
    }


    getCurrentDirectoryName(): string {
        return this.currentDirectory.name
    }


    setCurrentDirectory(dir: DirectoryNode): void {
        this.currentDirectory = dir
    }


    createDirectory(name: string): boolean {
        return this.getCurrentDirectory().createDirectory(name)
    }


    /**
     * Check that the given path is valid and return the directory that is at the end of the
     * path if valid
     * @param path 
     */
    validatePath(path: string): PathResult {
        // if path starts with / then the path is absolute so we start at root
        let current: DirectoryNode = path.startsWith("/") ? this.root : this.currentDirectory

        const parts = path.split("/").filter(p => p !== "") // filter empty strings
        for (const part of parts) {
            if (part === ".") continue
            if (part === "..") {
                if (current.parent) current = current.parent // move one back if able
                continue
            }

            // check if part is a child directory of current directory
            const child = current.findChildDirectory(part)
            if (!child) return {exists: false, directory: null}
            current = child
        }
        return {exists: true, directory: current}
    }


    deleteFile(filename: string): boolean {
        return this.currentDirectory.deleteFile(filename)
    }


    createFile(filename: string): boolean {
        return this.currentDirectory.createFile(filename)
    }


    deleteDirectory(dirName: string): DeleteDirectoryResultObject {
        const resultObject: DeleteDirectoryResultObject = {
            wasSuccess: false,
            message: ""
        }

        const dirObject: DirectoryNode | undefined = this.currentDirectory.findChildDirectory(dirName)

        if (!dirObject) {
            resultObject.message = `Error: couldn't find directory ${dirName}`
            return resultObject
        }
    
        const containsChildDirs = dirObject.getChildDirectories().length !== 0
        const containsFiles = dirObject.getFiles().length !== 0

        if (containsChildDirs || containsFiles) {
            resultObject.message = "Error: directory is not empty"
            return resultObject
        }

        this.currentDirectory.deleteDirectory(dirName)

        resultObject.wasSuccess = true
        return resultObject
    }

}