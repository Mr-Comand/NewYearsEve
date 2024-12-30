// Function to get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to set URL parameter
function setUrlParameter(name, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
}

// Hide or show background images based on the checkbox state
function toggleBackground() {
    const checkbox = document.getElementById('toggle-bg');
    const backgroundContainer = document.getElementById('background-container');
    if (checkbox.checked) {
        backgroundContainer.classList.add('hidden');
        setUrlParameter('disableImages', 'true');
    } else {
        backgroundContainer.classList.remove('hidden');
        setUrlParameter('disableImages', '');
    }
}

// Show/hide config menu
document.getElementById('config-icon').addEventListener('click', () => {
    const configMenu = document.getElementById('config-menu');
    configMenu.style.display = configMenu.style.display === 'none' ? 'block' : 'none';
});

// Set the checkbox state based on the URL parameter
function setCheckboxState() {
    const checkbox = document.getElementById('toggle-bg');
    checkbox.checked = getUrlParameter('disableImages') === 'true';
    toggleBackground(); // Apply the initial state
}

// Move, scale, and rotate countdown
function moveCountdown(action) {
    const countdown = document.getElementById('countdown');
    let top = parseInt(getUrlParameter('countdownTop') || 50);
    let left = parseInt(getUrlParameter('countdownLeft') || 50);
    let scale = parseFloat(getUrlParameter('countdownScale') || 1);
    let rotate = parseFloat(getUrlParameter('countdownRotate') || 0);
    const stepSize = parseInt(document.getElementById('step-size').value) || 5;

    switch (action) {
        case 'up':
            top -= stepSize;
            break;
        case 'down':
            top += stepSize;
            break;
        case 'left':
            left -= stepSize;
            break;
        case 'right':
            left += stepSize;
            break;
        case 'increase':
            scale += stepSize / 100;
            break;
        case 'decrease':
            scale -= stepSize / 100;
            break;
        case 'rotate-left':
            rotate -= stepSize;
            break;
        case 'rotate-right':
            rotate += stepSize;
            break;
    }

    countdown.style.top = `${top}%`;
    countdown.style.left = `${left}%`;
    countdown.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;

    setUrlParameter('countdownTop', top);
    setUrlParameter('countdownLeft', left);
    setUrlParameter('countdownScale', scale);
    setUrlParameter('countdownRotate', rotate);
}

// Apply initial countdown position, scale, and rotation
function applyCountdownConfig() {
    const countdown = document.getElementById('countdown');
    const top = getUrlParameter('countdownTop') || 50;
    const left = getUrlParameter('countdownLeft') || 50;
    const scale = getUrlParameter('countdownScale') || 1;
    const rotate = getUrlParameter('countdownRotate') || 0;

    countdown.style.top = `${top}%`;
    countdown.style.left = `${left}%`;
    countdown.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;
}

// Apply custom thanks text
function applyThanksText() {
    const thanksInput = document.getElementById('thanks-input').value;
    const thanksText = document.getElementById('thanks-text');
    thanksText.innerText = thanksInput;
    setUrlParameter('thanksText', thanksInput);
}

// Load custom thanks text from URL
function loadThanksText() {
    const thanksText = getUrlParameter('thanksText') || '';
    document.getElementById('thanks-input').value = thanksText;
    document.getElementById('thanks-text').innerText = thanksText;
}

// Call the functions to set the checkbox state and apply the initial configuration
setCheckboxState();
applyCountdownConfig();
loadThanksText();