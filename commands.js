const commands = {
    // Main group commands
    help: {
        name: 'help',
        group: 'main',
        description: 'Shows available commands',
        args: [],
        execute: () => {
            const groups = {};
            Object.values(commands).forEach(cmd => {
                const group = cmd.group || 'main';
                if (!groups[group]) groups[group] = [];
                groups[group].push(cmd);
            });

            let max = 0;
            Object.values(commands).forEach(cmd => {
                let len = `  ${cmd.name} ${cmd.args.length ? ` ${cmd.args.join(' ')}` : ''}`.length;
                if (len > max) max = len;
            });

            // Format each group
            return Object.entries(groups)
                .map(([name, cmds]) => {
                    return cmds.map(cmd => {
                        let str = `  ${cmd.name} ${cmd.args.length ? ` ${cmd.args.join(' ')}` : ''}`;
                        let off = max - str.length;
                        return '  ' + str + ' '.repeat(off) + '       ' + cmd.description;
                    }).join('\n') + '\n';
                })
                .join('\n');
        }
    },
    about: {
        name: 'about',
        group: 'main',
        description: 'Display information about me',
        args: [],
        execute: () => {
            let logo = ""
            logo += "    __                       ___                     __    " + "\n"
            logo += "   / /  __  ___________     /   |  _________  ____  / /___ " + "\n"
            logo += "  / /  / / / / ___/ __ `/  / /| | / ___/ __ `/ __ \\/ / __ \\" + "\n"
            logo += " / /__/ /_/ / /__/ /_/ /  / ___ |/ /  / /_/ / /_/ / / /_/ /" + "\n"
            logo += "/_____\\__,_/\\___/\\__,_/  /_/  |_/_/   \\__, /\\____/_/\\____/ " + "\n"
            logo += "                                     /____/                "
            
            const today = new Date();
            const birthDate = new Date('2001-02-14');
            const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

            let desc = ""
            desc += `<a href="mailto:lucaargolo@gmail.com">Email</a> <a href="https://github.com/lucaargolo">GitHub</a> <a href="http://discordapp.com/users/189070608905011220">Discord</a> `
            desc += "\n"
            desc += "\n"
            desc += "Hi, I'm a " + age + " year old developer from Brazil, and you're at my website." + "\n"
            desc += "I have a degree in Computer Science from the Federal University of Bahia (UFBA)." + "\n"
            desc += "\n"
            desc += "I work part-time as a freelancer doing game/modding commissions." + "\n"
            desc += `I also occasionally publish my own projects in sites like <a href="https://www.curseforge.com/members/d4rkness_king/projects">CurseForge</a> and <a href="https://modrinth.com/user/D4rkness_King">Modrinth</a>` + "\n"
            desc += "\n"
            desc += "My main interests are: " + "\n"
            desc += "  - Minecraft Modding" + "\n"
            desc += "  - Game Development" + "\n"
            desc += "  - Computer Graphics" + "\n"
            desc += "  - Procedural Generation" + "\n"
            desc += "\n"
            desc += "Today is " + today

            return logo + "\n\n" + desc
        }
    },
    clear: {
        name: 'clear',
        description: 'Clear the terminal',
        args: [],
        execute: () => {
            terminal.querySelectorAll('.output').forEach(child => child.remove());
            return '';
        }
    },
    ls: {
        name: 'ls',
        group: 'filesystem',
        description: 'List directory contents',
        args: ['[path]'],
        execute: (args) => fs.ls(args[0])
    },
    cd: {
        name: 'cd',
        group: 'filesystem',
        description: 'Change directory',
        args: ['(path)'],
        execute: (args) => fs.cd(args[0])
    },
    touch: {
        name: 'touch',
        group: 'filesystem',
        description: 'Create a new file',
        args: ['(file)', '[content]'],
        execute: (args) => {
            const filename = args[0];
            const content = args.slice(1).join(' ');
            return fs.touch(filename, content);
        }
    },
    cat: {
        name: 'cat',
        group: 'filesystem',
        description: 'Display file contents',
        args: ['(file)'],
        execute: (args) => fs.cat(args[0])
    },
    rainbow: {
        name: 'rainbow',
        group: 'fun',
        description: 'Toggle rainbow color effect',
        args: [],
        execute: () => {
            rainbow = !rainbow;
            return 'Rainbow mode activated! Run again to stop.';
        }
    },
    color: {
        name: 'color',
        group: 'fun',
        description: 'Set terminal color',
        args: ['(color)'],
        execute: (args) => {
            color = args[0];
            return 'Color set!';
        }
    }
};