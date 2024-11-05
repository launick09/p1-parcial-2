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
const orden = document.getElementById('orden');

function mostrar(content) {
    contenedor.replaceChildren();
    contenedor.appendChild(content);
    setEventos();
}

function mostrarCarrito() {
    // TODO: revisar si hay un flash o estoy cansado
    carrito.toHtml();    
    setEventos();   
}

function cargarJson() {
    console.log('cargando productos..');
    // fetch('/productos.json')
    fetch('https://launick09.github.io/p1-parcial-2/productos.json')
    .then(respuesta => respuesta.json() )
    .then(respuesta => {
        listado.createFromJson(respuesta);
        listado.sortStock();
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

    const productos = listado.productos.filter(producto => {
        const estaEnRango = producto.precio >= rangoMin && producto.precio <= rangoMax;
        const estaEnCategoria = categoria ? producto.categoria === categoria : true;
        return estaEnRango && estaEnCategoria;
    });

    mostrar(listado.toHtml(productos));
}

function calcularCantidad() {
    if(carrito.getCantidad()){
        cantidad.classList.remove('d-none');
        cantidad.querySelector('span').innerText = carrito.getCantidad();
    }else{
        cantidad.classList.add('d-none');
    }
    
}

function setEventos() {
    // Botones para agregar productos
    const addButtons = document.querySelectorAll('button[aria-data-id]');
    addButtons.forEach(button => {
        // button.removeEventListener('click', agregarItem);
        button.addEventListener('click', agregarItem);
        button.addEventListener('click', mostrarCarrito);
    });
    // Botones para ver la información del producto
    const infoButtons = document.querySelectorAll('button[aria-info-id]');
    infoButtons.forEach(button => {
        button.removeEventListener('click', verItem);
        button.addEventListener('click', verItem);
    });
    // Botones para bajar la cantidad en el carrito
    const decreaseButtons = document.querySelectorAll('button[aria-data-decrease-id]');
    decreaseButtons.forEach(button => {
        button.removeEventListener('click', removerItem);
        button.addEventListener('click', removerItem);
        button.addEventListener('click', mostrarCarrito);
    });
    // Botones para eliminar el producto del carrito
    const deleteButtons = document.querySelectorAll('button[aria-data-delete-id]');
    deleteButtons.forEach(button => {
        button.removeEventListener('click', eliminarItem);
        button.addEventListener('click', eliminarItem);
        button.addEventListener('click', mostrarCarrito);
    });
}

function agregarItem(e) {
    const id = Number(e.currentTarget.getAttribute('aria-data-id'));
    const producto = listado.productos.find(producto => producto.id === id);
    try {
        carrito.addItem(producto);
        calcularCantidad();
    } catch (error) {
        alert(error);
    }
}
function verItem(e) {
    const id = Number(e.currentTarget.getAttribute('aria-info-id'));
    const item = listado.productos.find(producto => producto.id === id);
    producto.getInfo(item);
}
function removerItem(e) {
    const id = Number(e.currentTarget.getAttribute('aria-data-decrease-id'));
    const producto = carrito.items.find(item => item.producto.id === id);
    if (producto) {
        carrito.addItem(producto.producto, -1);
        calcularCantidad();
    }
}
function eliminarItem(e) {
    const id = Number(e.currentTarget.getAttribute('aria-data-delete-id'));
    carrito.removeItem(id);
    calcularCantidad();
}

window.addEventListener('DOMContentLoaded', cargarJson);
window.addEventListener('DOMContentLoaded', calcularCantidad);

document.querySelectorAll('#filtros .change').forEach(input => {
    input.addEventListener('input', filtrarProductos);
});

orden.addEventListener('change', () => {
    const productos = listado.sortStock(orden.value);
    mostrar(listado.toHtml(productos));
});

button.addEventListener('click', mostrarCarrito);

// usar local storage <- para guardar el carrito
//