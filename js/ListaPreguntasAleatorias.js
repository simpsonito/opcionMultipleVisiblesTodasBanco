/**
 * Created by adib on 04/08/15.
 */
window.addEventListener("load", function(){

    var MAX_INTENTOS_POR_PREGUNTA = 2;
    var MAX_PREGUNTAS = 10;
    var ATRIBUTO_CORRECTO = "data-correcta";
    var buenas = 0;
    var contestadas = 0;
    var seccionPreguntas = document.body.querySelector("#bancoPreguntas");
    var totalInicialBanco = seccionPreguntas.children.length;
    var listaInicialBanco = seccionPreguntas.children;
    var retro = prepararRetroPop();

    Array.prototype.forEach.call(listaInicialBanco, function(){//Revuelve todas las preguntas
        seccionPreguntas.appendChild(listaInicialBanco[Math.floor(Math.random() * totalInicialBanco)]);
    });
    while(seccionPreguntas.children.length > MAX_PREGUNTAS){
        seccionPreguntas.removeChild(seccionPreguntas.firstChild);
    }

    var listaFinalPreguntas = seccionPreguntas.children;
    Array.prototype.forEach.call(listaFinalPreguntas, function(pregunta){
        var contenedorOpciones = pregunta.querySelector(".opciones");
        var contenedorOpcionesHijos = contenedorOpciones.children;
        contenedorOpciones.intentos = 0;
        Array.prototype.forEach.call(contenedorOpcionesHijos, function(opcion){
            opcion.addEventListener("click", alApretarOpcion);
            opcion.padre = contenedorOpciones;
        });
        Array.prototype.forEach.call(contenedorOpcionesHijos, function(opcion, indice, opciones){
            contenedorOpciones.appendChild(opciones[Math.floor(Math.random() * opciones.length)]);
        });

    });

    function alApretarOpcion(e){
        var boton = e.currentTarget;
        desactivar(boton);
        if(boton.getAttribute(ATRIBUTO_CORRECTO) === "true"){
            boton.className += " bien";
            desactivarSet(boton.padre);
            boton.removeAttribute("disabled");
            buenas++;
            revisar();
        } else {
            boton.className += " mal";
            if(++boton.padre.intentos >= MAX_INTENTOS_POR_PREGUNTA){
                desactivarSet(boton.padre);
                revisar();
            }
        }
    }
    function desactivar(boton){
        boton.setAttribute("disabled", "disabled");
        boton.disabled = true;
        boton.removeEventListener("click", alApretarOpcion);
    }
    function desactivarSet(conjunto){
        Array.prototype.forEach.call(conjunto.children, function(boton){
            //console.log(boton);
            desactivar(boton);
            if(boton.getAttribute(ATRIBUTO_CORRECTO) === "true" && boton.className.indexOf("bien") < 0){
                boton.className += " bienPerdida";
            }
        });
    }
    function revisar(){
        if(++contestadas === MAX_PREGUNTAS){
            retro.mostrar("Obtuviste: " + buenas + " de " + MAX_PREGUNTAS + ".");
        }
    }
    function prepararRetroPop(){
        var retroFinal = document.getElementById("retroFinal");
        var mensajeFinal = document.getElementById("retroFinalMensaje");
        retroFinal.addEventListener("click", quitarRetro, false);
        document.getElementById("botonCerrarRetro").addEventListener("click", quitarRetro, false);
        function quitarRetro(){
            retroFinal.style.display = "none";
        }
        function darRetroPop(mensaje) {
            retroFinal.style.display = "";
            mensajeFinal.innerHTML = mensaje;
        }
        function agregarRetroPop(mensaje){
            retroFinal.style.display = "";
            mensajeFinal.innerHTML += "<br />" + mensaje;
        }
        return {mostrar:darRetroPop, agregar:agregarRetroPop};
    }

}, false);