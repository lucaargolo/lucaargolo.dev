const prompt = document.getElementById('prompt');
const home = '/home/guest'

class FileSystem {
    constructor() {
        this.root = {
            type: 'dir',
            name: '/',
            children: {},
            parent: null
        };
        this.currentDir = this.root;
    }

    // Helper method to resolve path
    resolvePath(path) {
        if (!path) return this.currentDir;

        const isAbsolute = path.startsWith('/');
        const parts = path.split('/').filter(p => p && p !== '.');
        let current = isAbsolute ? this.root : this.currentDir;

        for (const part of parts) {
            if (part === '..') {
                current = current.parent || current;
                continue;
            }
            if (!current.children[part]) {
                return null;
            }
            current = current.children[part];
        }
        return current;
    }

    // Get current working directory path
    pwd() {
        const parts = [];
        let current = this.currentDir;
        while (current !== this.root) {
            parts.unshift(current.name);
            current = current.parent;
        }
        let pwd = '/' + parts.join('/');
        if(pwd === home) {
            return "~"
        }else{
            return pwd
        }
    }

    // Change directory
    cd(path) {
        if (!path) {
            this.currentDir = this.root;
            return '';
        }

        if(path === "~") {
            path = home
        }

        const target = this.resolvePath(path);
        if (!target) {
            return `cd: no such directory: ${path}`;
        }
        if (target.type !== 'dir') {
            return `cd: not a directory: ${path}`;
        }

        this.currentDir = target;
        //Theres an invisible character down here, so some browsers stop making this a email link.
        prompt.innerText = "guest@​lucaargolo.dev:" + this.pwd() + "$ ";
        return '';
    }

    // List directory contents
    ls(path) {
        const target = this.resolvePath(path || '.');
        if (!target) {
            return `ls: no such file or directory: ${path}`;
        }

        if (target.type === 'file') {
            return target.name;
        }

        return Object.values(target.children)
            .map(item => item.name + (item.type === 'dir' ? '/' : ''))
            .join(' ');
    }

    // Create directory
    mkdir(path) {
        if (!path) {
            return 'mkdir: missing operand';
        }

        const parts = path.split('/');
        const dirName = parts.pop();
        const parentPath = parts.join('/');
        const parent = this.resolvePath(parentPath || '.');

        if (!parent) {
            return `mkdir: cannot create directory '${path}': No such file or directory`;
        }
        if (parent.type !== 'dir') {
            return `mkdir: cannot create directory '${path}': Not a directory`;
        }
        if (parent.children[dirName]) {
            return `mkdir: cannot create directory '${path}': File exists`;
        }

        parent.children[dirName] = {
            type: 'dir',
            name: dirName,
            children: {},
            parent: parent
        };
        return '';
    }

    // Create a new file
    touch(path, content = '') {
        if (!path) {
            return 'touch: missing filename';
        }

        const parts = path.split('/');
        const fileName = parts.pop();
        const parentPath = parts.join('/');
        const parent = this.resolvePath(parentPath || '.');

        if (!parent) {
            return `touch: cannot create file '${path}': No such directory`;
        }
        if (parent.type !== 'dir') {
            return `touch: cannot create file '${path}': Not a directory`;
        }
        if (parent.children[fileName] && parent.children[fileName].type === 'dir') {
            return `touch: cannot create file '${path}': Is a directory`;
        }

        parent.children[fileName] = {
            type: 'file',
            name: fileName,
            content: content,
            parent: parent
        };
        return '';
    }

    // Read file contents
    cat(path) {
        if (!path) {
            return 'cat: missing filename';
        }

        const target = this.resolvePath(path);
        if (!target) {
            return `cat: ${path}: No such file or directory`;
        }
        if (target.type === 'dir') {
            return `cat: ${path}: Is a directory`;
        }

        return target.content || '';
    }

}

// Create filesystem instance
const fs = new FileSystem();

// Initialize with some directories
fs.mkdir('/home');
fs.mkdir('/bin')
fs.mkdir('/etc');

// Setup user
fs.mkdir(home);
fs.cd(home);

// Create some files
fs.touch("hello.txt", "Hello, World!");