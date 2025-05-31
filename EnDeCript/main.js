function handleEncrypt() {
    const input = document.getElementById('inputBox').value.toLowerCase();
    const encrypted = EC.encrypt(input);
    document.getElementById('output').textContent = "Encrypted Message:";
    document.getElementById('result').textContent = encrypted;
    checkStatus()
}

function handleDecrypt() {
    const input = document.getElementById('inputBox').value.toLowerCase();
    const decrypted = EC.decrypt(input);
    document.getElementById('output').textContent = "Decrypted Message:";
    document.getElementById('result').textContent = decrypted;
    checkStatus()
}

async function copyToClipboard() {
    try {
        const text = document.getElementById('result').textContent;
        navigator.clipboard.writeText(text);
        document.getElementById('status').textContent = "Copied to clipboard!";
        await new Promise(resolve => setTimeout(resolve, 3000));
        document.getElementById('status').textContent = "";
    } catch (err) {
        alert("Failed to copy: " + err);
    }
    checkStatus()
}

async function getClipboardText() {
    try {
        const text = await navigator.clipboard.readText();
        const inputBox = document.getElementById('inputBox');
        inputBox.value = text;
        document.getElementById('status').textContent = "Pasted from clipboard!";
        await new Promise(resolve => setTimeout(resolve, 3000));
        document.getElementById('status').textContent = "";
    } catch (err) {
        alert("Failed to read clipboard contents: " + err);
    }
    checkStatus()
}

function checkStatus() {
    const input = document.getElementById('inputBox').value.toLowerCase();
    if (input.trim() === "") {
        document.getElementById("enc").disabled = true;
        document.getElementById("dec").disabled = true;
    } else {
        document.getElementById("enc").disabled = false;
        document.getElementById("dec").disabled = false;
    }
    const text = document.getElementById('result').textContent;
    if (text.trim() === "") {
        document.getElementById("copy").disabled = true;
    } else {
        document.getElementById("copy").disabled = false;
    }
}

document.getElementById("inputBox").addEventListener("input", function() {
    checkStatus();
});

checkStatus()