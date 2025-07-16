let activeLink;

if (pageName === "Home" || pageCate === "Home") {
    activeLink = document.getElementById("home");
}
if (pageName === "CV" || pageCate === "CV") {
    activeLink = document.getElementById("cv");
}
if (pageName === "Notes" || pageCate === "Notes") {
    activeLink = document.getElementById("notes");
}
if (pageName === "Projects" || pageCate === "Projects") {
    activeLink = document.getElementById("projects");
}
if (pageName === "Teaching"  || pageCate === "Teaching") {
    activeLink = document.getElementById("teaching");
}
if (pageName === "Contact"  || pageCate === "Contact") {
    activeLink = document.getElementById("contact");
}
activeLink.classList.add("active");