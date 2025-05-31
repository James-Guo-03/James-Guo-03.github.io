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
        alert("Copied to clipboard!");
    }).catch(err => {
        alert("Failed to copy: " + err);
    });
}
