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
        logo.src = "indeximg/logoblanco.png";
        btn.src = "indeximg/menublanco.png";
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("darkMode", "off");
        logo.src = "indeximg/logonegro.png"; 
        btn.src = "indeximg/menunegro.png";
    }
});



// CARGAR CONFIG
window.addEventListener("DOMContentLoaded", () => {

    //  MODO OSCURO
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "on") {
        document.body.classList.add("dark");
        toggle.checked = true;
        logo.src = "indeximg/logoblanco.png";
        btn.src = "indeximg/menublanco.png";
    }


});

let grafica;

function agregar(valor){

    const input =
        document.getElementById("funcion");

    input.value += valor;

    actualizarDerivada();
}



function borrar(){

    const input =
        document.getElementById("funcion");

    input.value =
        input.value.slice(0,-1);

    actualizarDerivada();
}

function limpiar(){

    document.getElementById(
        "funcion"
    ).value = "";

    document.getElementById(
        "derivadaTexto"
    ).innerText = "";

    document.getElementById(
        "tablaResultados"
    ).innerHTML = "";

    document.getElementById(
        "raizFinal"
    ).innerText = "";

    if(grafica){

        grafica.destroy();
    }
}

function actualizarDerivada(){

    let funcionTexto =
        document.getElementById(
            "funcion"
        ).value;

    funcionTexto =
        corregirFuncion(funcionTexto);

    try{

        if(funcionTexto.trim()===""){

            document.getElementById(
                "derivadaTexto"
            ).innerText = "";

            return;
        }

        const derivada =
            math.derivative(
                funcionTexto,
                'x'
            ).toString();

        document.getElementById(
            "derivadaTexto"
        ).innerText = derivada;

    }
    catch(error){

        document.getElementById(
            "derivadaTexto"
        ).innerText = "Error";
    }
}


function corregirFuncion(funcion){

    funcion = funcion.replace(
        /(\d)(x)/g,
        '$1*$2'
    );

    funcion = funcion.replace(
        /(\d+\.\d+)(x)/g,
        '$1*$2'
    );

    funcion = funcion.replace(
        /(\d)(sin|cos|tan|log|exp|sqrt)/g,
        '$1*$2'
    );

    funcion = funcion.replace(
        /x(sin|cos|tan|log|exp|sqrt)/g,
        'x*$1'
    );

    funcion = funcion.replace(
        /(\d)\(/g,
        '$1*('
    );

    funcion = funcion.replace(
        /x\(/g,
        'x*('
    );

    return funcion;
}

function calcularNewton(){

    try{

       
let funcionTexto =
document.getElementById("funcion").value;

funcionTexto =
corregirFuncion(funcionTexto);

        const derivadaTexto =
            math.derivative(
                funcionTexto,
                'x'
            ).toString();

        const x0 =
            parseFloat(
                document.getElementById(
                    "x0"
                ).value
            );

        const iteraciones =
            parseInt(
                document.getElementById(
                    "iteraciones"
                ).value
            );

        const tabla =
            document.getElementById(
                "tablaResultados"
            );

        tabla.innerHTML = "";

        let x = x0;

        let labels = [];

        let errores = [];

        for(let i=0;i<iteraciones;i++){

            const fx =
                math.evaluate(
                    funcionTexto,
                    {x:x}
                );

            const dfx =
                math.evaluate(
                    derivadaTexto,
                    {x:x}
                );

            if(dfx===0){

                alert(
                    "La derivada es 0"
                );

                return;
            }

            const xnuevo =
                x - (fx/dfx);

            const error =
                Math.abs(
                    xnuevo - x
                );

            tabla.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${xnuevo.toFixed(8)}</td>
                    <td>${error.toFixed(8)}</td>
                </tr>
            `;

            labels.push(
                "Iter "+(i+1)
            );

            errores.push(error);

            x = xnuevo;
        }

        document.getElementById(
            "raizFinal"
        ).innerText =
            x.toFixed(10);

        crearGrafica(
            labels,
            errores
        );

    }
    catch(error){

        console.log(error);

        alert(
            "Error en la función"
        );
    }
}

function crearGrafica(
    labels,
    errores
){

    const canvas =
        document.getElementById(
            "grafica"
        );

    if(!canvas){
        return;
    }

    const ctx =
        canvas.getContext("2d");

    if(grafica){

        grafica.destroy();
    }

    grafica = new Chart(ctx,{

        type:'line',

        data:{

            labels:labels,

            datasets:[{

                label:'Error',

                data:errores,

                borderWidth:3,

                tension:0.3
            }]
        },

        options:{

            responsive:true
        }
    });
}