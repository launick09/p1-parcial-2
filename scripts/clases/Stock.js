'use strict';

/**
 * Arroyo Lautaro Alan
 * Adaptacion de Discografia, del parcial 1
 */

import { Producto } from './Producto.js';
import { ElementBuilder } from './ElementBuilder.js';

/**
 * @class Stock
 * Métodos:
 * - addProducto(producto): Agrega un nuevo producto al stock.
 * - toHtml(): Devuelve HTML para el stock.
 * - createFromJson(json): agrega productos de un json (array).
 */

export class Stock {
    constructor() {
        this.productos = []; // Array para almacenar productos
    }

    /**
     * Agrega un nuevo producto al stock.
     * @param {Producto} producto - producto a agregar.
     */
    addProducto(producto) {
        if (producto instanceof Producto) {
            this.productos.push(producto);
        } else {
            console.warn('El elemento agregado no es un Producto');
        }
    }

    /**
     * Devuelve HTML para el stock.
     * @returns {HTMLElement} - Elemento HTML que contiene todos los productos.
     */
    toHtml() {
        const list = new ElementBuilder('div').setAttributes({ class: 'row' });
        this.productos.forEach(producto => {
            const column = new ElementBuilder('div').setAttributes({ class: 'col-12 col-sm-6 col-md-4 col-xl-3' });
            
            const productHtml = producto.toHtml();  
                      
            column.addElementChild(productHtml);
            list.addElementChild(column);
        });

        return list.getElement();
    }


     /**
     * Crea productos a partir de un array de objetos.
     * @param {Array} json - Array de objetos que representan productos.
     */
    createFromJson(json){
        try {   
            json.forEach(data => {
                const { id, nombre, descripcion, precio, imagen, categoria, stock, rating } = data;
                let producto = new Producto(id, nombre, descripcion, precio, imagen, categoria, stock, rating);
                this.addProducto(producto);
            });
        } catch (error) {
            console.warn("Error al crear discos desde JSON:", error);
        }
    }
}