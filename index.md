---
layout: default
title: "Home"
---

<div style="text-align: center;">
    <img id="rotatingImage" src="/photos/photo_1.jpg" width="300" alt="photo">
</div>

<script>
  const photos = ["/photos/photo_1.jpg", "/photos/photo_2.jpg", "/photos/photo_3.jpg", "/photos/photo_4.jpg", "/photos/photo_5.jpg"];
  let index = 0;

  function rotateImage() {
    index = (index + 1) % photos.length;
    document.getElementById("rotatingImage").src = photos[index];
  }

  setInterval(rotateImage, 5000);
</script>

## Hello. This is James “Siyuan” Guo, and I am a junior at Johns Hopkins University. I major in Mathematics and Computer Science.

I am currently working as a Teaching Assistant for an introductory computing class (`AS.250.205` Introduction to Computing) and the head PILOT (peer-led-team learning) leader for an introductory ODEs class (`AS.110.302` Differential Equations and Applications).

I have volunteered for the International Student at Hopkins (ISAH) organization and Maryland Science Olympiad (MSO) in the past. This year, I was in charge of the Johns Hopkins Math Tournament (JHMT), which is a math tournament for high school and middle school students.