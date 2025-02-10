const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const lineHeight = 2;
const lineSpacing = 2;
const alpha = 0.5;
const speed = 0.05;
let offset = 0;

function drawVignette() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScanlines() {
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    for (let y = offset; y < canvas.height; y += lineHeight + lineSpacing) {
        ctx.fillRect(0, y, canvas.width, lineHeight);
    }
    offset = (offset + speed) % (lineHeight + lineSpacing);
}

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function updateCanvas() {
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScanlines();
    drawVignette();
    requestAnimationFrame(updateCanvas);
}

requestAnimationFrame(updateCanvas);