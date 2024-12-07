'use strict';

import { Stock } from './clases/Stock.js';
import { Carrito } from './clases/Carrito.js';
import { Producto } from './clases/Producto.js';
import { Oferta } from './clases/Oferta.js';

/*
 * Arroyo Lautaro Alan
 */

const listado = new Stock();
const carrito = new Carrito();
const oferta = new Oferta();

let ofertas = [];

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

async function cargarOfertasJson() {
    console.log('cargando ofertas..');
    try {
        const respuesta = await fetch('/ofertas.json');
        const ofertasJson = await respuesta.json();
        ofertas = ofertasJson.map(ofertaData => new Oferta(
            ofertaData.id,
            ofertaData.tipo,
            ofertaData.valor,
            ofertaData.categorias,
            ofertaData.productos,
            ofertaData.descripcion
        ));
    } catch (error) {
        console.error('Error al cargar las ofertas');
        console.error(error);
    } finally {
        console.log('carga de ofertas finalizada.');
    }
}

async function cargarJson() {
    console.log('cargando productos..');
    try {
        // Esperar a que las ofertas se carguen primero
        await cargarOfertasJson();

        // const respuesta = await fetch('https://launick09.github.io/p1-parcial-2/productos.json');
        const respuesta = await fetch('/productos.json');
        const productos = await respuesta.json();

        listado.createFromJson(productos);
        
        vincularOfertasConProductos(listado.productos, ofertas);

        listado.sortStock();
        listado.setOptionsCategorias(categorias);
        carrito.cargarDesdeLocalStorage(listado);
        carrito.calcularCantidad();
        mostrar(listado.toHtml(carrito));
    } catch (error) {
        console.error('Error al cargar los productos');
        console.error(error);
    } finally {
        console.log('carga finalizada.');
    }
}

function vincularOfertasConProductos(productos, ofertas) {
    productos.forEach(producto => {
        
        const ofertasValidas = ofertas.filter(oferta => oferta.esValida(producto));
        producto.ofertas = ofertasValidas;
    });
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