let cursorTimeout;

function hideCursor() {
    document.body.style.cursor = 'none';
}

function resetCursorTimeout() {
    document.body.style.cursor = 'default';
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(hideCursor, 1000); // Hide cursor after 3 seconds of inactivity
}

document.addEventListener('mousemove', resetCursorTimeout);

// Initialize the cursor timeout
resetCursorTimeout();