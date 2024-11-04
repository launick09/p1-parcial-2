'use strict';

import { Stock } from './clases/Stock.js';
import { Carrito } from './clases/Carrito.js';
import { Producto } from './clases/Producto.js';

/*
 * Arroyo Lautaro Alan
 */

const listado = new Stock();
const carrito = new Carrito();
const producto = new Producto();

const button = document.getElementById('comprar');
const cantidad = document.getElementById('comprar-cantidad');

const contenedor = document.getElementById('productos');
const categorias = document.getElementById('categoria');


function mostrar(content) {
    contenedor.replaceChildren();
    contenedor.appendChild(content);
    setEventos();
}

function mostrarCarrito() {
    carrito.toHtml();
}

function cargarJson() {
    console.log('cargando productos..');
    // fetch('/productos.json')
    fetch('https://launick09.github.io/p1-parcial-2/productos.json')
    .then(respuesta => respuesta.json() )
    .then(respuesta => {
        listado.createFromJson(respuesta);
        mostrar( listado.toHtml())
        listado.setOptionsCategorias(categorias);
    })
    .catch( error => {
        console.error('Error al cargar');
        console.error(error);
    })
    .finally( console.log('carga finalizada.') );
}

function filtrarProductos() {
    const rangoMin = Number(document.getElementById('filtro-rango-min').value) || 0;
    const rangoMax = Number(document.getElementById('filtro-rango-max').value) || Infinity;
    const categoria = String(document.getElementById('categoria').value) || null;

    const productos = listado.productos.filter(producto =>  
        parseFloat(producto.precio) >= parseFloat(rangoMin) &&
        parseFloat(producto.precio) <= parseFloat(rangoMax) &&
        categoria ? producto.categoria === categoria : true
    );

    mostrar(listado.toHtml(productos));
}

function setEventos() {
    //funcionar, funciona
    const Addbuttons = document.querySelectorAll('button[aria-data-id]');
    Addbuttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = Number(button.getAttribute('aria-data-id'));
            const producto = listado.productos.find(producto => producto.id === id);
            try {
                carrito.addItem(producto);
                calcularCantidad();
            } catch (error) {
                alert(error);
            }
        });
    });
    const buttons = document.querySelectorAll('button[aria-info-id]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const id = Number(button.getAttribute('aria-info-id'));
            const item = listado.productos.find(producto => producto.id === id);
            producto.getInfo(item);
        });
    });
}

function calcularCantidad() {
    if(carrito.getCantidad()){
        cantidad.classList.remove('d-none');
        cantidad.querySelector('span').innerText = carrito.getCantidad();
    }else{
        cantidad.classList.add('d-none');
    }
    
}

window.addEventListener('DOMContentLoaded', cargarJson);
window.addEventListener('DOMContentLoaded', calcularCantidad);

document.querySelectorAll('#filtros .change').forEach(input => {
    input.addEventListener('input', filtrarProductos);
});

button.addEventListener('click', mostrarCarrito);

// usar local storage <- para guardar el carrito
//