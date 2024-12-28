const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('save');
const clearButton = document.getElementById('clear');
const loadInput = document.getElementById('load');
const gridCheckbox = document.getElementById('grid');
const output = document.getElementById('output');

const SIZE = 5; // Size of the drawn squares
const SCALE = 50; // Scale factor to ensure coordinates are between -50 and 50
const TOLERANCE = 2; // Tolerance for removing shapes

let shapes = [];
let gridify = false;

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left click
        const { x, y } = getMousePos(canvas, e);
        addShape(x, y);
    }
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const { x, y } = getMousePos(canvas, e);
    removeShape(x, y);
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
    output.value = '';
    drawCenterMarker();
    if (gridify) drawGrid();
});

saveButton.addEventListener('click', () => {
    const json = JSON.stringify(shapes, null, 2);
    output.value = json;
    downloadJSON(json, 'shapes.json');
});

loadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const json = event.target.result;
            shapes = JSON.parse(json);
            drawShapes();
        };
        reader.readAsText(file);
    }
});

gridCheckbox.addEventListener('change', (e) => {
    gridify = e.target.checked;
    drawShapes();
});

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function addShape(x, y) {
    const color = 'green'; // You can add a color picker to change this
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let relativeX = ((x - centerX) / centerX) * SCALE;
    let relativeY = ((y - centerY) / centerY) * SCALE;

    if (gridify) {
        relativeX = Math.round(relativeX);
        relativeY = Math.round(relativeY);
    }

    shapes.push({ coordinates: { x: relativeX, y: relativeY }, color });
    drawShape(relativeX, relativeY, color);
}

function removeShape(x, y) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const relativeX = ((x - centerX) / centerX) * SCALE;
    const relativeY = ((y - centerY) / centerY) * SCALE;
    shapes = shapes.filter(shape => !(Math.abs(shape.coordinates.x - relativeX) < TOLERANCE && Math.abs(shape.coordinates.y - relativeY) < TOLERANCE));
    drawShapes();
}

function drawShape(x, y, color) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scaledX = (x / SCALE) * centerX;
    const scaledY = (y / SCALE) * centerY;
    ctx.fillStyle = color;
    ctx.fillRect(centerX + scaledX, centerY + scaledY, SIZE, SIZE); // Draw a small square
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCenterMarker();
    if (gridify) drawGrid();
    shapes.forEach(shape => {
        const { x, y } = shape.coordinates;
        const color = shape.color;
        drawShape(x, y, color);
    });
}

function drawCenterMarker() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY);
    ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX, centerY - 10);
    ctx.lineTo(centerX, centerY + 10);
    ctx.stroke();
}

function drawGrid() {
    const step = canvas.width / (SCALE * 2);
    ctx.strokeStyle = 'lightgray';
    for (let i = step; i < canvas.width; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = step; i < canvas.height; i += step) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function downloadJSON(json, filename) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Draw the center marker initially
drawCenterMarker();