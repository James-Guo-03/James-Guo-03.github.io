---
layout: default
title: "EnDeCript Online"
---

# EnDeCript Online

The EnDeCript (online version) helps you to encode/decode a message using the standard that have been developed by me using a cipher. (ver 1.0)

<div style="text-align: center">
    <textarea id="inputBox" placeholder="Enter text here..."></textarea><br>
    <button onclick="handleEncrypt()">Encrypt</button> &nbsp; &nbsp;  
    <button onclick="handleDecrypt()">Decrypt</button>
    <br>
    <br>
    <h2 id="output"></h2>
    <br>
    <div id="result"></div>
    <br>
    <br>
    <button onclick="copyToClipboard()">Copy to Clipboard</button> &nbsp; &nbsp;  
    <button onclick="getClipboardText()">Paste from Clipboard</button>
    <br>
    <br>
    <div id="status"></div>
</div>

<script src="CC.js"></script>
<script src="EC.js"></script>
<script src="main.js"></script>