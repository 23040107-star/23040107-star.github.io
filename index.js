const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggle = document.getElementById("darkModeToggle");

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");

let playing = false;

function aplicarModoOscuro(activo) {
    document.body.classList.toggle("dark", activo);
    localStorage.setItem("darkMode", activo ? "on" : "off");
    toggle.checked = activo;
    btn.src = activo ? "indeximg/menublanco.png" : "indeximg/menunegro.png";
}

// CARGAR CONFIG
window.addEventListener("DOMContentLoaded", () => {

    //  MODO OSCURO
    const darkMode = localStorage.getItem("darkMode") === "on";
    aplicarModoOscuro(darkMode);

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
    aplicarModoOscuro(toggle.checked);
});

