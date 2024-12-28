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
async function fetchShapes(endpoint) {
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

async function createFireworkShapes(size, scale,firework,  shapeType, translationRange) {
    let shapes;
    try {
        shapes = await fetchShapes(`/shapes/${shapeType}.json`);
    } catch (error) {
        console.error('Failed to fetch shapes:', error);
        return;
    }

    const rotateDeg = getRandomInt(-45, 45);
    for (const shape of shapes) {
        const { x, y } = shape.coordinates;
        const color = shape.color;


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
// Function to create a new firework at a random position
function createFirework(sequenz) {
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

    body.innerHTML = "<img src=\"https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/fd/Firework_Rocket_JE2_BE2.png\" height=100%>"

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
    document.body.appendChild(firework);
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
