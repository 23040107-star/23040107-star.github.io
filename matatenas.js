// menu
const btn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const toggle = document.getElementById("darkModeToggle");
const logo = document.getElementById("logo");

let grafica;
let modoActual = "normal";

const modeConfig = {
    normal: {
        title: "Calculadora Normal",
        placeholder: "Operacion: 8*(3+2), sqrt(16), sin(pi/2)",
        label: "Resultado:"
    },
    newton: {
        title: "Newton-Raphson",
        placeholder: "Funcion f(x): x^3 - x - 2",
        label: "Raiz aproximada:"
    }
};

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

window.addEventListener("DOMContentLoaded", () => {
    const darkMode = localStorage.getItem("darkMode") === "on";
    aplicarModoOscuro(darkMode);
    toggle.checked = darkMode;
    cambiarModo("normal");
});

document.querySelectorAll(".mode-btn").forEach((button) => {
    button.addEventListener("click", () => cambiarModo(button.dataset.mode));
});

function aplicarModoOscuro(activo) {
    document.body.classList.toggle("dark", activo);
    localStorage.setItem("darkMode", activo ? "on" : "off");
    logo.src = activo ? "indeximg/logoblanco.png" : "indeximg/logonegro.png";
    btn.src = activo ? "indeximg/menublanco.png" : "indeximg/menunegro.png";
}

function cambiarModo(modo) {
    modoActual = modo;
    const config = modeConfig[modo];

    document.getElementById("calculator-title").innerText = config.title;
    document.getElementById("funcion").placeholder = config.placeholder;
    document.getElementById("resultadoLabel").innerText = config.label;

    document.querySelectorAll(".mode-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.mode === modo);
    });

    document.querySelectorAll(".mode-only").forEach((element) => {
        element.classList.remove("visible");
    });

    document.querySelectorAll(`.${modo}-mode`).forEach((element) => {
        element.classList.add("visible");
    });

    limpiar();
}

function agregar(valor) {
    const input = document.getElementById("funcion");
    input.value += valor;

    if (modoActual === "newton") {
        actualizarDerivada();
    }
}

function borrar() {
    const input = document.getElementById("funcion");
    input.value = input.value.slice(0, -1);

    if (modoActual === "newton") {
        actualizarDerivada();
    }
}

function limpiar() {
    document.getElementById("funcion").value = "";
    document.getElementById("derivadaTexto").innerText = "";
    document.getElementById("tablaResultados").innerHTML = "";
    document.getElementById("raizFinal").innerText = "";

    if (grafica) {
        grafica.destroy();
        grafica = null;
    }
}

function calcular() {
    if (modoActual === "normal") {
        calcularNormal();
        return;
    }

    if (modoActual === "newton") {
        calcularNewton();
        return;
    }

}

function calcularNormal() {
    try {
        const expresion = corregirFuncion(document.getElementById("funcion").value);
        const resultado = math.evaluate(expresion);
        document.getElementById("raizFinal").innerText = formatearNumero(resultado);
    } catch (error) {
        alert("Error en la operacion");
    }
}

function actualizarDerivada() {
    let funcionTexto = document.getElementById("funcion").value;
    funcionTexto = corregirFuncion(funcionTexto);

    try {
        if (funcionTexto.trim() === "") {
            document.getElementById("derivadaTexto").innerText = "";
            return;
        }

        const derivada = math.derivative(funcionTexto, "x").toString();
        document.getElementById("derivadaTexto").innerText = derivada;
    } catch (error) {
        document.getElementById("derivadaTexto").innerText = "Error";
    }
}

function corregirFuncion(funcion) {
    let corregida = funcion
        .replace(/\s+/g, "")
        .replace(/π/g, "pi")
        .replace(/(\d|\)|x|e|pi)(sin|cos|tan|log|exp|sqrt)\(/g, "$1*$2(")
        .replace(/(\d|\)|x|e|pi)\(/g, "$1*(")
        .replace(/\)(\d|x|e|pi)/g, ")*$1");

    let anterior;

    do {
        anterior = corregida;
        corregida = corregida.replace(/(\d|\)|x|e|pi)(x|e|pi)/g, "$1*$2");
    } while (corregida !== anterior);

    return corregida;
}

function calcularNewton() {
    try {
        const funcionTexto = corregirFuncion(document.getElementById("funcion").value);
        const derivadaTexto = math.derivative(funcionTexto, "x").toString();
        const x0 = parseFloat(document.getElementById("x0").value);
        const iteraciones = parseInt(document.getElementById("iteraciones").value);
        const tabla = document.getElementById("tablaResultados");

        if (Number.isNaN(x0) || Number.isNaN(iteraciones) || iteraciones <= 0) {
            alert("Ingresa x0 e iteraciones validas");
            return;
        }

        tabla.innerHTML = "";

        let x = x0;
        const labels = [];
        const errores = [];

        for (let i = 0; i < iteraciones; i++) {
            const fx = math.evaluate(funcionTexto, { x });
            const dfx = math.evaluate(derivadaTexto, { x });

            if (dfx === 0) {
                alert("La derivada es 0");
                return;
            }

            const xnuevo = x - (fx / dfx);
            const error = Math.abs(xnuevo - x);

            tabla.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${xnuevo.toFixed(8)}</td>
                    <td>${error.toFixed(8)}</td>
                </tr>
            `;

            labels.push("Iter " + (i + 1));
            errores.push(error);
            x = xnuevo;
        }

        document.getElementById("raizFinal").innerText = x.toFixed(10);
        crearGrafica(labels, errores);
    } catch (error) {
        console.log(error);
        alert("Error en la funcion");
    }
}

function formatearNumero(valor) {
    if (typeof valor !== "number") {
        return String(valor);
    }

    if (Number.isInteger(valor)) {
        return String(valor);
    }

    return Number(valor.toFixed(10)).toString();
}

function crearGrafica(labels, errores) {
    const canvas = document.getElementById("grafica");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    if (grafica) {
        grafica.destroy();
    }

    grafica = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Error",
                data: errores,
                borderWidth: 3,
                tension: 0.3
            }]
        },
        options: {
            responsive: true
        }
    });
}
