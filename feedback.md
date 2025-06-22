---
layout: default
title: "Feedback"
---

# Submit Your Feedback
  <form id="survey-form">
    Name: <input type="text" name="name" placeholder="Enter your name..."><br><br>
    Email: <input type="email" name="email" placeholder="Enter your email..."><br><br>
    <textarea id="inputBox" name="feedback" placeholder="Your feedback" required></textarea><br><br>
    <button type="submit">Submit</button>
  </form>

  <p id="response-msg"></p>

  <script>
    const form = document.getElementById('survey-form');
    const responseMsg = document.getElementById('response-msg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = {
        name: form.name.value,
        email: form.email.value,
        feedback: form.feedback.value
      };

      fetch("https://script.google.com/macros/s/AKfycbwFHocJT50NbaxhMSqgD9ROURYfRFD2RTFRtRDAo9jhvN0ti980h1XSUWIC3JmP8Mn_GA/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      .then(res => res.text())
      .then(msg => {
        responseMsg.textContent = "✅ Submitted successfully!";
        form.reset();
      })
      .catch(err => {
        responseMsg.textContent = "❌ Submission failed: " + err.message;
      });
    });
  </script>