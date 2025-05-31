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
}

async function getClipboardText() {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('inputBox').textContent = text;
        document.getElementById('status').textContent = "Pasted from clipboard!";
        await new Promise(resolve => setTimeout(resolve, 3000));
        document.getElementById('status').textContent = "";
    } catch (err) {
        alert("Failed to read clipboard contents: " + err);
    }
}

function checkStatus() {
    document.getElementById('status').textContent = "test1";
    const text = document.getElementById('inputBox').textContent;
    document.getElementById('status').textContent = "test2";
    if (text.trim() === "") {
        document.getElementById("enc").disabled = true;
        document.getElementById("dec").disabled = true;
        document.getElementById('status').textContent = "test21";
    } else {
        document.getElementById("enc").disabled = false;
        document.getElementById("dec").disabled = false;
        document.getElementById('status').textContent = "test22";
    }
    text = document.getElementById('result').textContent;
    document.getElementById('status').textContent = "test4";
    if (text.trim() === "") {
        document.getElementById("copy").disabled = true;
        document.getElementById('status').textContent = "test21";
    } else {
        document.getElementById("copy").disabled = false;
        document.getElementById('status').textContent = "test32";
    }
    document.getElementById('status').textContent = "test5";
}

document.getElementById("inputBox").addEventListener("input", function() {
    checkStatus();
});