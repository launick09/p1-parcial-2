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
 * - createFromJson(json): agrega productos de un json .
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
     * @param {String | null} criterio - ordena los productos en stock
     * (rating, más stock, menos stock, mayor precio, menor precio)
     * @returns 
     */
    sortStock(criterio = null) {
        //TODO: usar copia
        switch (criterio) {
            case 'rating':
                this.productos.sort((a, b) => b.rating - a.rating);
                break;
            case 'más stock':
                this.productos.sort((a, b) => b.stock - a.stock);
                break;
            case 'menos stock':
                this.productos.sort((a, b) => a.stock - b.stock);
                break;
            case 'mayor precio':
                this.productos.sort((a, b) => a.precio - b.precio);
                break;
            case 'menor precio':
                this.productos.sort((a, b) => b.precio - a.precio);
                break;
            default:
                this.productos.sort((a, b) => b.rating - a.rating);
                break;
        }
        return this.productos;
    }

    /**
     * Devuelve HTML para el stock.
     * @returns {HTMLElement} - Elemento HTML que contiene todos los productos.
     */
    toHtml(carrito, productos = null) {
        const listado = productos ?? this.productos;
        const list = new ElementBuilder('div').setAttributes({ class: 'row' });
        listado.forEach(producto => {
            const column = new ElementBuilder('div').setAttributes({ class: 'col-12 col-sm-6 col-md-4 col-xl-3' });            
            const productHtml = producto.toHtml(carrito);  
                      
            column.addElementChild(productHtml);
            list.addElementChild(column);
        });

        return list.getElement();
    }


    /**
     * @param {HTMLElement} contenedor - select al cual adjuntar las opciones
     * sirve para no poner los elementos manualmente 
     */
    setOptionsCategorias(contenedor){
        const categorias = new Set(this.productos.map(p => p.categoria).filter(Boolean));
        categorias.forEach(categoria => {
            const option = new ElementBuilder('option').setAttributes({ value: categoria }).addTextChild(categoria)
            contenedor.appendChild(option.getElement())
        });
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