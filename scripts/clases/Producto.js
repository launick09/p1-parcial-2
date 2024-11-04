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

        // Detalle del producto
        const DetalleElement = new ElementBuilder('button')
        .addTextChild('Detalle')
        .setAttributes({ 
            class: 'btn btn-sm w-100 btn-secondary my-1',
            'aria-info-id': this.id
         });
        // Agregar al carrito
        const buttonElement = new ElementBuilder('button')
            .addTextChild('Agregar al Carrito')
            .setAttributes({ 
                class: 'btn btn-sm w-100 btn-warning my-1',
                'aria-data-id': this.id
             });
            
        // agrego todo        
        infoDiv.addElementChild(stockElement);
        infoDiv.addElementChild(ratingElement);
        cardDiv.addElementChild(imageElement);
        cardDiv.addElementChild(infoDiv);
        cardDiv.addElementChild(nameElement);
        cardDiv.addElementChild(descriptionElement);
        precioDiv.addElementChild(priceElement);
        precioDiv.addElementChild(DetalleElement);
        precioDiv.addElementChild(buttonElement);
        cardDiv.addElementChild(precioDiv);
        return cardDiv.getElement();
    }
    
    getInfo(producto){        
        const productImage = new ElementBuilder('img')
            .setAttributes({ 
                src: producto.imagen,
                alt: producto.nombre, 
                class: 'img-fluid mb-3',
                // style: 'max-width: 300px;' 
            });

        const productName = new ElementBuilder('p')
            .addTextChild(producto.nombre)
            .setAttributes({ class: 'fw-bold h5' });

        const productDescription = new ElementBuilder('p')
            .addTextChild(producto.descripcion)
            .setAttributes({ class: 'text-muted' });

        const productPrice = new ElementBuilder('p')
            .addTextChild(`Price: $${producto.precio}`)
            .setAttributes({ class: 'text-primary' });

        const productRating = new ElementBuilder('p')
            .addTextChild(`Rating: ${producto.rating}★`)
            .setAttributes({ class: 'text-warning' });

        const imgContent = new ElementBuilder('div')
            .setAttributes({ class: 'col-12 col-md-4' })
            .addElementChild(productImage)
        const modalContent = new ElementBuilder('div')
            .setAttributes({ class: 'col-12 col-md-8' })
            .addElementChild(productName)
            .addElementChild(productDescription)
            .addElementChild(productPrice)
            .addElementChild(productRating);

        const rowContent = new ElementBuilder('div')
            .setAttributes({ class: 'row' })
            .addElementChild(imgContent)
            .addElementChild(modalContent)

        return new ElementBuilder('div').createModal( producto.nombre , rowContent.getElement());
    }

}