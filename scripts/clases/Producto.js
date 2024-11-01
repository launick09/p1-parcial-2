'use strict';

/*
 * Arroyo Lautaro Alan
 */

import { ElementBuilder } from './ElementBuilder.js';

/**
 * @class Producto
 * @property {String} nombre - El nombre de la canción.
 * @property {Number} duracion - La duracion de la canción.
 * @property {Number} id - Identificador único del producto.
 * @property {String} nombre - Nombre del producto.
 * @property {String} descripcion - Descripción del producto.
 * @property {Float} precio - Precio del producto.
 * @property {String} imagen - URL o ruta de la imagen del producto.
 * @property {String} categoria - Categoría a la que pertenece el producto.
 * @property {Number} stock - Cantidad disponible del producto en inventario (mayor a 0).
 * @property {Number} rating - Valoración del producto (entre 1 y 5).
 * 
 * Métodos:
 * - toHtml(): Devuelve HTML para el producto.
 */
export class Producto{
    constructor(id, nombre, descripcion, precio, imagen, categoria, stock, rating) {
         this.id = id; 
         this.nombre = nombre;
         this.descripcion = descripcion;
         this.precio = precio;
         this.imagen = imagen;
         this.categoria = categoria;
         this.stock = stock;
         this.rating = rating;
    }

    /**
     * Devuelve HTML
     * @returns {String} 
     */
    toHtml(){
        const cardDiv = new ElementBuilder('div')
            .setAttributes(
                { 
                    class: 'card border-0 m-auto p-2 h-100 d-flex', 
                    style: 'max-width: 400px;' 
                }
            );

        const infoDiv = new ElementBuilder('div').setAttributes({ class: 'd-flex justify-content-between my-1' });      
        // stock
        const stockElement = new ElementBuilder('p').addTextChild(`${this.stock}u disponibles`).setAttributes({ style: 'font-size: 0.7rem;' });      
        // rating
        const ratingElement = new ElementBuilder('p').addTextChild(`${this.rating} ★`);  

        // imagen
        const imageElement = new ElementBuilder('img')
            .setAttributes({
                src: this.imagen,
                alt: this.nombre,
                class: 'img w-100 h-auto',
                onerror: "this.src='https://png.pngtree.com/png-vector/20190917/ourmid/pngtree-not-found-circle-icon-vectors-png-image_1737851.jpg'",
                draggable: 'false'
            });

        // nombre del producto
        const nameElement = new ElementBuilder('h3').addTextChild(this.nombre);      

        // descripcion
        const descriptionElement = new ElementBuilder('p')
            .addTextChild(this.descripcion)
            .setAttributes({ class: 'text-muted' });
        
        const precioDiv = new ElementBuilder('div').setAttributes({ class: 'mt-auto' });

        // Precio
        const priceElement = new ElementBuilder('p')
            .addTextChild(`$ ${this.precio.toFixed(2)}`)
            .setAttributes({ class: 'text-muted text-end', style: 'font-size: 0.7rem;' });

        // Agregar al carrito
        const buttonElement = new ElementBuilder('button')
            .addTextChild('Agregar al Carrito')
            .setAttributes({ class: 'btn btn-sm w-100 btn-warning' });
            
        // agrego todo        
        infoDiv.addElementChild(stockElement);
        infoDiv.addElementChild(ratingElement);
        cardDiv.addElementChild(imageElement);
        cardDiv.addElementChild(infoDiv);
        cardDiv.addElementChild(nameElement);
        cardDiv.addElementChild(descriptionElement);
        precioDiv.addElementChild(priceElement);
        precioDiv.addElementChild(buttonElement);
        cardDiv.addElementChild(precioDiv);
        return cardDiv.getElement();
    }

}