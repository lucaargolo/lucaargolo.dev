const terminal = document.getElementById('terminal');

const commandHistory = [];
let historyIndex = -1;
let lastTabPress = 0;
let suggestions = [];
let suggestionIndex = 0;
let scrollTimeout;
let isUserScroll = true;

document.addEventListener('click', function() {
    focus()
})

terminal.addEventListener('mousemove', function(e) {
    const rect = terminal.getBoundingClientRect();
    const distanceFromRight = rect.right - e.clientX;
    
    if (distanceFromRight <= 25) {
        terminal.classList.add('show-scrollbar');
    } else {
        terminal.classList.remove('show-scrollbar');
    }
});

terminal.addEventListener('mouseleave', function() {
    terminal.classList.remove('show-scrollbar');
});

terminal.addEventListener('scroll', function() {
    if (!isUserScroll) {
        terminal.classList.remove('show-scrollbar');
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isUserScroll = true
        }, 100);
    }else{
        terminal.classList.add('show-scrollbar');
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            if (!terminal.matches(':hover')) {
                terminal.classList.remove('show-scrollbar');
            }
        }, 1000);
    }
});

document.getElementById("input").addEventListener('keydown', function(e) {
    const input = document.getElementById("input")
    if (e.key === 'Tab') {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastTabPress > 500) {
            suggestions = suggest(input.value);
            suggestionIndex = 0;
        }

        if (suggestions.length > 0) {
            complete(suggestions[suggestionIndex]);
            suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        }

        lastTabPress = now;
    } else if (e.key === 'Enter') {
        suggestions = [];

        const inputValue = input.value.trim();
        input.value = '';
        if (inputValue) {
            commandHistory.push(inputValue);
            historyIndex = commandHistory.length;
        }

        const prompt = document.getElementById('prompt')
        const promptText = prompt ? prompt.textContent : "";
        
        const commandOutput = document.createElement('p');
        commandOutput.className = 'output';
        commandOutput.innerHTML = `${promptText}${inputValue}`;

        terminal.insertBefore(commandOutput, terminal.lastElementChild);
        bottom()

        execute(inputValue);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else if (historyIndex === commandHistory.length - 1) {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
});

async function execute(input) {
    let commandInterface = terminal.lastElementChild
    terminal.removeChild(commandInterface)

    const parts = input.trim().split(' ');
    const name = parts[0].toLowerCase();

    let output = '';
    
    const command = commands[name];
    if (command) {
        let args = parts.slice(1)
        let j = command.args.length
        let k = command.args.filter(arg => arg[0] === '(').length;
        let n = args.length;
        if (k > n) {
            output = `Missing arguments. Type 'help' for command syntax.`;
        } else {
            let result = args.slice(0, j - 1);
            result.push(args.slice(j - 1).join(" "));
            output = await command.execute(result);
        }
    } else {
        output = `Command not found: ${name}. Type 'help' for available commands.`;
    }

    print(output)
    terminal.appendChild(commandInterface)
    bottom()
    focus()
}

function print(output) {
    const commandOutput = document.createElement('p');
    commandOutput.className = 'output';
    commandOutput.innerHTML = output;
    terminal.appendChild(commandOutput);
    bottom()
}

function suggest(input) {
    const parts = input.trim().split(' ');
    const current = parts[parts.length - 1];

    if (parts.length === 1) {
        return Object.keys(commands)
            .filter(cmd => cmd.startsWith(current))
            .sort();
    }

    const currentDir = fs.resolve('.');
    if (!currentDir || !currentDir.children) return [];

    return Object.keys(currentDir.children)
        .filter(name => name.startsWith(current))
        .sort();
}

function complete(completion) {
    const input = document.getElementById("input")
    const parts = input.value.trim().split(' ');
    parts[parts.length - 1] = completion;
    input.value = parts.join(' ');
}

function bottom() {
    isUserScroll = false;
    terminal.scrollTop = terminal.scrollHeight;
}

function focus() {
    document.getElementById("input").focus()
}
 
execute('about')