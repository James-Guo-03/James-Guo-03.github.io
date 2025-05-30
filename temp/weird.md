---
title: "Is James freaky?"
---

# Is James freaky?

<div style="text-align: left;">
    <button onclick="handleClickYes()" id="clickBtnY">Yes</button> &nbsp; &nbsp;   <button onclick="handleClickNo()" id="clickBtnN">No</button>
</div>

✅ Yes: <span id="yesCount">0</span><br>
❌ No Votes: <span id="noCount">0</span>

<script>
    // Initialize counts as 0
    let yesCount = parseInt(localStorage.getItem("yesCount")) || 0;
    let noCount = parseInt(localStorage.getItem("noCount")) || 0;
    document.getElementById("yesCount").innerText = yesCount;
    document.getElementById("noCount").innerText = noCount;

    // If already voted
    if (localStorage.getItem("hasVoted")) {
        disableVoting();
        document.getElementById("message").innerText = "You have already voted.";
    }

    function handleClickYes() {
        yesCount++;
        localStorage.setItem("yesCount", yesCount);
        localStorage.setItem("hasVoted", "true");
        document.getElementById("yesCount").innerText = yesCount;
        document.getElementById("message").innerText = "You just voted Yes!";
        disableVoting();
    }

    function handleClickNo() {
        noCount++;
        localStorage.setItem("noCount", noCount);
        localStorage.setItem("hasVoted", "true");
        document.getElementById("noCount").innerText = noCount;
        document.getElementById("message").innerText = "You just voted No!";
        disableVoting();
    }

    function disableVoting() {
        document.getElementById("clickBtnY").disabled = true;
        document.getElementById("clickBtnN").disabled = true;
    }
</script>