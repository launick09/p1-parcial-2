'use strict';

import { Stock } from './clases/Stock.js';
import { Carrito } from './clases/Carrito.js';
import { Producto } from './clases/Producto.js';

/*
 * Arroyo Lautaro Alan
 */

const listado = new Stock();
const carrito = new Carrito();

const button = document.getElementById('comprar');

const contenedor = document.getElementById('productos');
const categorias = document.getElementById('categoria');
const orden = document.getElementById('orden');

const rangoMaximo = document.getElementById('filtro-rango-max');
const maximoDisplay = document.getElementById('max-value-display');

function mostrar(content) {
    contenedor.replaceChildren();
    contenedor.appendChild(content);
}

// cambiar min max por slider - Done
// -1 unidades - Done
// Si, hay un flash al regenerar el DOM - ya No
// usar funciones para remover y eliminar o unificar() - Done
// usar local storage <- para guardar el carrito Done

function cargarJson() {
    console.log('cargando productos..');
    // fetch('/productos.json')
    fetch('https://launick09.github.io/p1-parcial-2/productos.json')
    .then(respuesta => respuesta.json() )
    .then(respuesta => {
        listado.createFromJson(respuesta);
        listado.sortStock();
        listado.setOptionsCategorias(categorias);
        carrito.cargarDesdeLocalStorage(listado);
        carrito.calcularCantidad();
        mostrar( listado.toHtml(carrito))
    })
    .catch( error => {
        console.error('Error al cargar');
        console.error(error);
    })
    .finally( console.log('carga finalizada.') );
}

function filtrarProductos() {    
    const rangoMax = Number(rangoMaximo.value) || Infinity;
    
    const categoria = String(document.getElementById('categoria').value) || null;

    const productos = listado.productos.filter(producto => {
        const estaEnRango = producto.precio <= rangoMax;
        const estaEnCategoria = categoria ? producto.categoria === categoria : true;
        return estaEnRango && estaEnCategoria;
    });
    mostrar(listado.toHtml(carrito, productos));
}


window.addEventListener('DOMContentLoaded', () => {
    cargarJson();   
    button.addEventListener('click', () => carrito.toHtml());
});

document.querySelectorAll('#filtros .change').forEach(input => {
    input.addEventListener('input', filtrarProductos);
});

rangoMaximo.addEventListener('input', (e) => {
    maximoDisplay.textContent = e.target.value == 0 ? '' : e.target.value + ' $' ;
});

orden.addEventListener('change', () => {
    const productos = listado.sortStock(orden.value);
    mostrar(listado.toHtml(carrito,productos));
    filtrarProductos();
});