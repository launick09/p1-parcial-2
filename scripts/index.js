'use strict';

import { Stock } from './clases/Stock.js';

/*
 * Arroyo Lautaro Alan
 */

const listado = new Stock();
const contenedor = document.getElementById('productos');


function mostrar(content) {
    contenedor.replaceChildren();
    contenedor.appendChild(content);
}

function cargarJson() {
    console.log('cargando productos..');
    fetch('/productos.json')
    .then(respuesta => respuesta.json() )
    .then(respuesta => {
        listado.createFromJson(respuesta);
        mostrar( listado.toHtml())
    })
    .catch( error => {
        console.error('Error al cargar');
        console.error(error);
    })
    .finally( console.log('carga finalizada.') );
}

window.addEventListener('DOMContentLoaded', cargarJson)


// usar local storage
//