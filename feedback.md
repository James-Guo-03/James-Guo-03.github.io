---
layout: default
title: "Feedback"
category: "Contact"
---

# Submit Your Feedback
  <form id="survey-form">
  <div style="width: 75%; margin: 0 auto;">
    <p>
        Name: 
        <input type="text" name="name" placeholder="Enter your name...">
        (<i>Not Required</i>) <br>
    </p>
    <p>
        Email:
        <input type="email" name="email" placeholder="Enter your email..."> 
        (<i>Not Required</i>) <br>
    </p>
    Your Feedback:
  </div>
    <textarea id="inputBox" name="feedback" placeholder="Enter your feedback here..." style="font-size: 16px; height: 39px;" required></textarea><br>
    <div style="text-align: center;">
    <button type="submit" id="submitBtn">Submit</button>
    </div>
  </form>

  <script>
    const form = document.getElementById('survey-form');
    const responseMsg = document.getElementById('response-msg');

    form.addEventListener('submit', function (e) {
        document.getElementById("submitBtn").disabled = true;
        e.preventDefault();

      const formData = {
        name: form.name.value,
        email: form.email.value,
        feedback: form.feedback.value
      };

      fetch("https://script.google.com/macros/s/AKfycbwoyJ84s40GPgfnNU4fjPryLnLuRZQUHKBwt5C0sZDRY5N01_jeH5bcXLkWnyZCrkSoDg/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      .then(res => res.text())
      .then(msg => {
        alert("✅ Form submitted successfully!");
        form.reset();
        document.getElementById("submitBtn").disabled = false;
      })
      .catch(err => {
        alert("❌ Something is wrong, please submit again!");
        document.getElementById("submitBtn").disabled = false;
      });
    });
  </script>