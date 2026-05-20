// menu
const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggle = document.getElementById("darkModeToggle");
const logo = document.getElementById("logo");

const music = document.getElementById("bg-music");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const musicBtn = document.getElementById("musicBtn");

let playing = false;

function aplicarModoOscuro(activo) {
    document.body.classList.toggle("dark", activo);
    localStorage.setItem("darkMode", activo ? "on" : "off");
    toggle.checked = activo;
    logo.src = activo ? "indeximg/logoblanco.png" : "indeximg/logonegro.png";
    btn.src = activo ? "indeximg/menublanco.png" : "indeximg/menunegro.png";
}

btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});


toggle.addEventListener("change", () => {
    aplicarModoOscuro(toggle.checked);
});



// CARGAR CONFIG
window.addEventListener("DOMContentLoaded", () => {


    //  MODO OSCURO
    const darkMode = localStorage.getItem("darkMode") === "on";
    aplicarModoOscuro(darkMode);

});
function abrirModal(img) {
    const modal = document.getElementById("modal");
    const imagenGrande = document.getElementById("imagenGrande");

    modal.style.display = "flex";
    imagenGrande.src = img.src;
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}
