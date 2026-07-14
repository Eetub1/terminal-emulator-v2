import type { PathResult, DeleteDirectoryResultObject, SerializedDirectory } from "../types"

export class FileNode {
    
    public name: string
    public contents: string

    constructor(name: string, contents: string="") {
        this.name = name
        this.contents = contents
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


    /**
     * Converting the whole filesystem into a format that can be added to localstorage
     * @returns the serialized rootnode of the filesystem
     */
    serialize(): SerializedDirectory {
        return {
            name: this.name,
            files: this.files.map(fileNode => ({name: fileNode.name, contents: fileNode.contents})),
            childDirectories: this.childDirectories.map(dir => dir.serialize())
        }
    }


    /**
     * Static method that deserializes a serialized directory taken from localstorage
     * @param data   Current directorynode
     * @param parent Parentnode of the current directorynode
     * @returns      Deserialized rootnode of the filesystem
     */
    static deserialize(data: SerializedDirectory, parent: DirectoryNode | null): DirectoryNode {
        const name = data.name
        const files = data.files
        
        const newDir = new DirectoryNode(parent, name)
        const newFiles = []
        for (const file of files) {
            const newFile = new FileNode(file.name, file.contents)
            newFiles.push(newFile)
        }

        newDir.files = newFiles
        newDir.childDirectories = data.childDirectories.map(dir => this.deserialize(dir, newDir))
        return newDir
    }
}


export class FileSystem {

    private root: DirectoryNode
    private currentDirectory: DirectoryNode

    constructor() {
        // If there is something in LS use that, else create a new root node
        this.root = this.loadFromLocalStorage() ?? new DirectoryNode(null, "~")
        this.currentDirectory = this.root
    }


    /**
     * Tries to load filesystem from localstorage and deserialize it
     * @returns 
     */
    loadFromLocalStorage(): DirectoryNode | null {
        const raw = localStorage.getItem("fileSystem")
        if (!raw) return null

        try {
            console.log(raw)
            const parsed = JSON.parse(raw)
            return DirectoryNode.deserialize(parsed, null)
        } catch {
            return null // something failed
        }
    }


    getCurrentDirectory(): DirectoryNode {
        return this.currentDirectory
    }


    getRoot(): DirectoryNode {
        return this.root
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


    createDirectory(name: string): boolean {
        const result = this.getCurrentDirectory().createDirectory(name)
    
        if (result) this.saveFileSystemToLocalStorage() // LOCALSTORAGE
        return result
    }


    deleteFile(filename: string): boolean {
        const result = this.currentDirectory.deleteFile(filename)
        
        if (result) this.saveFileSystemToLocalStorage() // LOCALSTORAGE
        return result
    }


    createFile(filename: string): boolean {
        const result = this.currentDirectory.createFile(filename)

        if (result) this.saveFileSystemToLocalStorage() // LOCALSTORAGE
        return result
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
        this.saveFileSystemToLocalStorage() // LOCALSTORAGE

        resultObject.wasSuccess = true
        return resultObject
    }


    saveFileSystemToLocalStorage(): void {
        localStorage.setItem("fileSystem", JSON.stringify(this.root.serialize()))
    }
}