function generateRandomNormal(mean, standardDeviation) {
    let u1 = Math.random();
    let u2 = Math.random();

    let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    // Adjust for mean and standard deviation
    return z0 * standardDeviation + mean;
}
function getRandomInt(min, max) {
    var a = Math.floor(Math.random() * (max - min + 1)) + min;
    return a;
}
const shapeCache = {};

async function fetchShapes(endpoint) {
    if (shapeCache[endpoint]) {
        return shapeCache[endpoint];
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    shapeCache[endpoint] = data; // Cache the response
    return data;
}

async function createFireworkShapes(size, scale, firework, shapeType, translationRange) {
    let shape;
    try {
        shape = await fetchShapes(`/shapes/${shapeType}.json`);
    } catch (error) {
        console.error('Failed to fetch shapes:', error);
        return;
    }

    const rotateDeg = getRandomInt(-45, 45);
    randomColorMap = {};
    for (const point of shape) {

        const { x, y } = point.coordinates;

        let color = point.color;
        if (point.color.startsWith("random")) {
            if (!randomColorMap[point.color]) {
                randomColorMap[point.color] = generateRandomIntenseColor();
            }
            color = randomColorMap[point.color];
        }



        let translateY = (y - 6.5) * size * scale / 2 + getRandomInt(-translationRange, translationRange) / 30;
        let translateX = (x - 6.5) * size * scale / 2 + getRandomInt(-translationRange, translationRange) / 30;
        translateX, translateY = rotate_2d(translateX, translateY, (rotateDeg * Math.PI) / 180);

        const head = document.createElement('div');
        head.style.setProperty("--translateY_v", translateY + "px");
        head.style.setProperty("--translateX_v", translateX + "px");
        head.style.setProperty("--rotateDeg_v", rotateDeg + "px");
        head.style.setProperty("background-color", color);

        head.classList.add("head");
        firework.appendChild(head);
        firework.style.setProperty("--scale", scale / 2);
    }
}
// Preload the image and draw it onto a canvas
const fireworkCanvas = document.createElement('canvas');
const fireworkCtx = fireworkCanvas.getContext('2d');
const fireworkImage = new Image();
fireworkImage.src = "https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Firework_Rocket_JE2_BE2.png";
fireworkImage.onload = () => {
    const scaleFactor = 0.1; // Scale down by 10 times
    fireworkCanvas.width = fireworkImage.width * scaleFactor;
    fireworkCanvas.height = fireworkImage.height * scaleFactor;
    fireworkCtx.drawImage(fireworkImage, 0, 0, fireworkCanvas.width, fireworkCanvas.height);
    console.log("Image preloaded and drawn onto canvas");
};

// Function to create a new firework at a random position
function createFirework(sequenz) {
    const fireworkContainer = document.getElementById('firework-container');
    const firework = document.createElement('div');
    firework.className = 'firework';
    switch (sequenz) {
        case 0:
            firework.style.left = Math.random() * window.innerWidth + 'px';
            break;
        case 1:
            firework.style.left = 0.20 * window.innerWidth + 'px';
            break;
        case 2:
            firework.style.left = 0.50 * window.innerWidth + 'px';
            break;
        case 3:
            firework.style.left = 0.80 * window.innerWidth + 'px';
            break;

    }
    var body = document.createElement('div');
    body.classList.add("body");
    var size = getRandomInt(1, 50);
    firework.appendChild(body);
    // Remove the firework element after the animation ends



    var scale = getRandomInt(1, 25) / 25;

    firework.style.setProperty("--scale", scale);

    var height = getRandomInt(10, 80);
    if (sequenz !== 0) {
        height = getRandomInt(15, 30);
        getRandomInt(20, 25) / 20;
        size = getRandomInt(30, 35);
    }
    if (height > 50) {
        scale = scale * (1 / (height / 50));
    } else {
        scale = scale / (height / 50);
    }

    // Create a new canvas and copy the content from the preloaded canvas
    const canvasClone = document.createElement('canvas');
    canvasClone.width = fireworkCanvas.width;
    canvasClone.height = fireworkCanvas.height;
    const ctxClone = canvasClone.getContext('2d');
    ctxClone.drawImage(fireworkCanvas, 0, 0);

    // Style the cloned canvas and append it to the body
    canvasClone.style.width = fireworkCanvas.width + "px"; // Set the desired width
    canvasClone.style.height = fireworkCanvas.height + "px"; // Set the desired height
    canvasClone.style.position = "absolute";
    canvasClone.style.top = "50%";
    canvasClone.style.left = "50%";
    canvasClone.style.transform = "translate(-50%, -50%)";
    body.appendChild(canvasClone);

    if (scale >= 1) {
        firework.classList.add("ifo_hill");
    }
    firework.style.setProperty("--height", height + "vh");
    var angel = generateRandomNormal(0, 10);
    var angleInRadians = (angel * Math.PI) / 180;// Convert angle to radians
    var xpos = (Math.tan((angel * Math.PI) / 180) * (100 - height));

    firework.style.setProperty("--x-pos", xpos + "vh");
    firework.style.setProperty("--angel", angel + "deg");

    const randomColor = generateRandomIntenseColor();
    var type;
    if (sequenz == 0) {
        type = getRandomInt(1, 9);
    } else {
        type = -1 * sequenz
    }
    const flash = getRandomInt(0, 10) > 9;
    generateflainr(type, firework, size, height, randomColor, scale, flash);
    if (type <= 5 && type >= 0) {
        for (let i = 0; i < getRandomInt(0, 3); i++) {
            generateflainr(type, firework, size + getRandomInt(20, 50), height, generateRandomIntenseColor(), scale, flash);
        }
    }
    firework.addEventListener('animationend', () => {
        firework.remove();
    });
    fireworkContainer.appendChild(firework);
    setTimeout(() => firework.remove(), 2500);
}

// Create a new firework every 2 seconds
function sequenz_call() {
    createFirework(1);
    setTimeout(function () { createFirework(2); }, 500);
    setTimeout(function () { createFirework(3); }, 1500);
}

setInterval(function () { createFirework(0); }, 250);
setInterval(function () { sequenz_call(); }, 20000);
sequenz_call();
createFirework();

function generateflainr(type, firework, size, height, randomColor, scale, flash) {
    switch (type) {
        case -1:
            createFireworkShapes(size, scale, firework, 'frohes', 100);
            break;

        case -2:
            createFireworkShapes(size, scale, firework, 'neues', 100);
            break;

        case -3:
            createFireworkShapes(size, scale, firework, 'jahr_', 150);
            break;

        case 6:
            createFireworkShapes(size, scale, firework, 'creeper', 100);
            break;

        case 7:
            createFireworkShapes(size, scale, firework, 'jahr', 100);
            break;

        case 8:
            createFireworkShapes(size, scale, firework, 'smily', 100);
            break;

        case 9:
            createFireworkShapes(size, scale, firework, 'sekt', 100);
            break;

        default:
            var rotateDeg = Math.random() * 360;
            for (let i = 0; i < getRandomInt(10, 30); i++) {
                const x = getRandomInt(-10, 10);
                const y = getRandomInt(-10, 10);
                var translateY = y * size * scale / 2;
                var translateX = x * size * scale / 2;

                var head = document.createElement('div');
                head.style.setProperty("--translateY_v", translateY + "px");
                head.style.setProperty("--translateX_v", translateX + "px");
                head.style.setProperty("--rotateDeg_v", rotateDeg + "px");
                head.style.setProperty("background-color", randomColor);
                if ((getRandomInt(0, 5) == 5) || flash) head.classList.add("flash");
                head.classList.add("head");
                firework.appendChild(head);
            }
            break;
    }
}

function generateRandomIntenseColor() {
    const hue = getRandomInt(0, 360); // Random hue value between 0 and 360
    const saturation = 100; // Maximum saturation for intensity
    const lightness = getRandomInt(50, 100); // Random lightness between 50 and 100 for intensity

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
green = "green"
function rotate_2d(x, y, angel) {
    x_o = (x * Math.cos(angel)) - (y * Math.sin(angel));
    y_o = (x * Math.sin(angel)) + (y * Math.cos(angel));
    return x_o, y_o;
};
