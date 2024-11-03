'use strict';

import { Stock } from './clases/Stock.js';
import { Carrito } from './clases/Carrito.js';

/*
 * Arroyo Lautaro Alan
 */

const listado = new Stock();
const carrito = new Carrito();

const contenedor = document.getElementById('productos');
const contenedorCarrito = document.getElementById('carrito');


function mostrar(content) {
    contenedor.replaceChildren();
    contenedor.appendChild(content);
    setEventos();
}

function mostrarCarrito() {
    contenedorCarrito.replaceChildren();
    contenedorCarrito.appendChild( carrito.toHtml() );
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


function setEventos() {
    //funcionar, funciona
    const buttons = document.querySelectorAll('button[aria-data-id]');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(button.getAttribute('aria-data-id'));
            const producto = listado.productos.find(producto => producto.id === id);
            carrito.addItem(producto);
        });
    });
}

window.addEventListener('DOMContentLoaded', cargarJson);
window.addEventListener('DOMContentLoaded', mostrarCarrito);


// usar local storage <- para guardar el carrito
//