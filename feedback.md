---
layout: page
title: "Feedback Form"
---

<form id="survey-form">
  <input type="text" name="name" placeholder="Your name" required><br>
  <input type="email" name="email" placeholder="Your email" required><br>
  <textarea name="feedback" placeholder="Your feedback" required></textarea><br>
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.getElementById('survey-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      email: form.email.value,
      feedback: form.feedback.value
    };

    fetch("https://script.google.com/macros/s/AKfycbwFHocJT50NbaxhMSqgD9ROURYfRFD2RTFRtRDAo9jhvN0ti980h1XSUWIC3JmP8Mn_GA/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(response => alert("Your feedback is recorded!"))
    .catch(err => alert("Error: " + err.message));
  });
</script>
