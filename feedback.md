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

      fetch("https://script.google.com/macros/s/AKfycbwoyJ84s40GPgfnNU4fjPryLnLuRZQUHKBwt5C0sZDRY5N01_jeH5bcXLkWnyZCrkSoDg/exec", {
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