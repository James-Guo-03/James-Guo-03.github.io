function handleEncrypt() {
    const input = document.getElementById('inputBox').value.toLowerCase();
    const encrypted = EC.encrypt(input);
    document.getElementById('output').textContent = "Encrypted Message:";
    document.getElementById('result').textContent = encrypted;
}

function handleDecrypt() {
    const input = document.getElementById('inputBox').value.toLowerCase();
    const decrypted = EC.decrypt(input);
    document.getElementById('output').textContent = "Decrypted Message:";
    document.getElementById('result').textContent = decrypted;
}

function copyToClipboard() {
    const text = document.getElementById('result').textContent;
    navigator.clipboard.writeText(text).then(() => {
        document.getElementById('status').textContent = "Copied to clipboard!";
        setInterval(rotateImage, 3000);
        document.getElementById('status').textContent = "";
    }).catch(err => {
        alert("Failed to copy: " + err);
    });
}

async function getClipboardText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputBox').textContent = text;
        document.getElementById('status').textContent = "Pasted from clipboard!";
        setInterval(rotateImage, 3000);
        document.getElementById('status').textContent = "";
    } catch (err) {
        alert("Failed to read clipboard contents: " + err);
    }
}

