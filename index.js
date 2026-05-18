const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggle = document.getElementById("darkModeToggle");

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");

let playing = false;

// CARGAR CONFIG
window.addEventListener("DOMContentLoaded", () => {

    //  MODO OSCURO
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "on") {
        document.body.classList.add("dark");
        toggle.checked = true;
    }


});

// MENÚ
btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

// MODO OSCURO
toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");

    if (toggle.checked) {
        localStorage.setItem("darkMode", "on");
    } else {
        localStorage.setItem("darkMode", "off");
    }
});

