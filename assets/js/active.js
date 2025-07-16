let activeLink;

if ("{{ page.title }}" === "Home" || "{{ page.category }}" === "Home") {
    activeLink = document.getElementById("home");
}
if ("{{ page.title }}" === "CV" || "{{ page.category }}" === "CV") {
    activeLink = document.getElementById("cv");
}
if ("{{ page.title }}" === "Notes" || "{{ page.category }}" === "Notes") {
    activeLink = document.getElementById("notes");
}
if ("{{ page.title }}" === "Projects" || "{{ page.category }}" === "Projects") {
    activeLink = document.getElementById("projects");
}
if ("{{ page.title }}" === "Teaching"  || "{{ page.category }}" === "Teaching") {
    activeLink = document.getElementById("teaching");
}
if ("{{ page.title }}" === "Contact"  || "{{ page.category }}" === "Contact") {
    activeLink = document.getElementById("contact");
}
activeLink.classList.add("active");