let rainbow = false;
let color = null

function toHex(color) {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computedColor = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    
    const rgb = computedColor.match(/\d+/g).map(Number);
    const hex = rgb.map(x => x.toString(16).padStart(2, '0')).join('');
    return `#${hex}`;
}

function updateColor() {
    if (rainbow) {
        const hue = (Date.now() / 20) % 360;
        const rainbowColor = `hsl(${hue}, 100%, 50%)`;

        document.documentElement.style.setProperty('--terminal-color', rainbowColor);
        document.documentElement.style.setProperty('--crt-glow', `2px 0 2px ${toHex(rainbowColor)}bb`);
    }else{
        if(color) {
            document.documentElement.style.setProperty('--terminal-color', color);
            document.documentElement.style.setProperty('--crt-glow', `2px 0 2px ${toHex(color)}bb`);
        }else{
            document.documentElement.style.removeProperty('--terminal-color');
            document.documentElement.style.removeProperty('--crt-glow');
        }
    }
}

function updateEffects() {
    updateColor();
    requestAnimationFrame(updateEffects);
}

requestAnimationFrame(updateEffects);