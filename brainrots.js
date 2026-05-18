// menu
const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggle = document.getElementById("darkModeToggle");

const music = document.getElementById("bg-music");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const musicBtn = document.getElementById("musicBtn");

let playing = false;

btn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});


toggle.addEventListener("change", () => {
    if (toggle.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("darkMode", "on");
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("darkMode", "off");
    }
});



// CARGAR CONFIG
window.addEventListener("DOMContentLoaded", () => {


    //  MODO OSCURO
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "on") {
        document.body.classList.add("dark");
        toggle.checked = true;
    }


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
