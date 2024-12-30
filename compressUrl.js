const paramAliases = {
    disableImages: 'di',
    countdownTop: 'ct',
    countdownLeft: 'cl',
    countdownScale: 'cs',
    countdownRotate: 'cr',
    thanksText: 'tt'
};

// Function to compress and encode URL parameters using base64url
function compressUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        if (value) { // Only include non-empty parameters
            const alias = paramAliases[key] || key;
            params[alias] = value;
        }
    }
    if (Object.keys(params).length === 0) {
        return ''; // Return an empty string if there are no parameters
    }
    const jsonString = JSON.stringify(params);
    const compressed = pako.deflate(jsonString);
    const base64String = btoa(String.fromCharCode.apply(null, compressed))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // base64url encoding
    return base64String;
}

// Function to decompress and decode URL parameters using base64url
function decompressUrl(base64String) {
    const binaryString = atob(base64String.replace(/-/g, '+').replace(/_/g, '/'));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.inflate(bytes, { to: 'string' });
    const params = JSON.parse(decompressed);
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        const originalKey = Object.keys(paramAliases).find(k => paramAliases[k] === key) || key;
        urlParams.set(originalKey, value);
    }
    console.log('Decompressed URL parameters:', urlParams.toString());
    window.location.href = `/?${urlParams}`;
}

// Event listener for the share icon
document.getElementById('share-icon').addEventListener('click', () => {
    const compressedUrl = compressUrl();
    const shareUrl = compressedUrl ? `${window.location.origin}/s/?c=${compressedUrl}` : window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'New Year\'s Eve',
            text: 'Check out this New Year\'s Eve countdown!',
            url: shareUrl
        }).catch((error) => console.error('Error sharing:', error));
    } else {
        // Fallback for browsers that do not support the Web Share API
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('URL copied to clipboard');
        }).catch((error) => console.error('Error copying URL to clipboard:', error));
    }
});

// Check if a compressed URL is loaded and decompress it
const compressedParam = new URLSearchParams(window.location.search).get('c');
if (compressedParam) {
    decompressUrl(compressedParam);
}