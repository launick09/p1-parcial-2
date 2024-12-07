'use strict';

/*
 * Arroyo Lautaro Alan
 */

import { ElementBuilder } from './ElementBuilder.js';
import { TIPO_2x1 } from './Oferta.js';
import { Oferta } from './Oferta.js';

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
 * @property {<Array>Object} ofertas - Ofertas.
 * 
 * Métodos:
 * - toHtml(): Devuelve HTML para el producto.
 */
export class Producto{
    constructor(id, nombre, descripcion, precio, imagen, categoria, stock, rating, ofertas = [], galeria = []) {
         this.id = id; 
         this.nombre = nombre;
         this.descripcion = descripcion;
         this.precio = precio;
         this.imagen = imagen;
         this.galeria = galeria;
         this.categoria = categoria;
         this.stock = stock;
         this.rating = rating;
         this.ofertas = ofertas;
    }

    // Método para calcular el precio con descuento
    obtenerPrecioConDescuento(cantidad = 1) {
        let precioFinal = this.precio * cantidad;
        this.ofertas.forEach(oferta => {
            const descuento = oferta.calcularDescuento(this, cantidad);
            precioFinal -= descuento;
        });

        return precioFinal;
    }

    // me devuelve la oferta si tiene
    getOferta(){
        return this.ofertas.find(oferta => oferta.esValida(this))
    }

    /**
     * Devuelve HTML
     * @returns {String} 
     */
    toHtml(carrito = null){        
        const cardDiv = new ElementBuilder('div')
            .setAttributes({ 
                class: 'card border-0 m-auto p-2 h-100 d-flex', 
                style: 'max-width: 400px;' 
            });
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
        const nameElement = new ElementBuilder('h3')
            .addTextChild(this.nombre)
            .setAttributes({
                class: 'text-truncate',
                title: this.nombre
            });      

        // descripcion
        const categoryElement = new ElementBuilder('p')
            .addTextChild(this.categoria)
            .setAttributes({ class: 'text-muted badge text-start p-0' });
        const descriptionElement = new ElementBuilder('p')
            .addTextChild(this.descripcion)
            .setAttributes({ class: 'text-muted' });
        
        const precioDiv = new ElementBuilder('div')
            .setAttributes({ class: 'mt-auto' });

        // Verificar si tiene oferta
        const oferta = this.getOferta();

        // Precio
        let priceElement = new ElementBuilder('p')
            .addTextChild(`$ ${this.precio.toFixed(2)}`)
            .setAttributes({ class: 'h3 text-muted text-end'});
        precioDiv.addElementChild(priceElement);
        // Si tiene una oferta, mostrar el descuento y el precio con descuento
        if (oferta) {
            let precioConDescuento = null;
            if(oferta.tipo == TIPO_2x1){
                precioConDescuento = new ElementBuilder('div')
                    .addTextChild(`2x1`)
                    .setAttributes({ 
                        class: 'text-white bg-success rounded p-1 ms-auto position-absolute',
                        style: 'width: fit-content; right: 0; margin-top: -4rem'
                    });
            }else{
                priceElement.setAttributes({
                    class: 'text-muted m-0 text-decoration-line-through text-end',
                    title: oferta.descripcion
                });
                precioConDescuento = new ElementBuilder('p')
                    .addTextChild(`$${oferta.calcularDescuento(this, 1).toFixed(2)}`)
                    .setAttributes({ class: 'h3 text-success text-end' });
            }
            precioDiv.addElementChild(precioConDescuento);
        }

        // Detalle del producto
        const DetalleElement = new ElementBuilder('button')
        .addTextChild('Detalle')
        .setAttributes({ 
            class: 'btn btn-sm w-100 btn-secondary my-1',
            'aria-info-id': this.id,
        });
        DetalleElement.getElement().addEventListener('click', () => this.getInfo(carrito));

        // Agregar al carrito
        const buttonElement = new ElementBuilder('button')
            .addTextChild('Agregar al Carrito')
            .setAttributes({ 
                class: 'btn btn-sm w-100 btn-warning my-1',
                'aria-data-id': this.id
             });
        if(carrito){
            buttonElement.getElement().addEventListener('click', () => carrito.addItem(this));
        }
            
        // agrego todo        
        infoDiv.addElementChild(stockElement);
        infoDiv.addElementChild(ratingElement);
        cardDiv.addElementChild(imageElement);
        cardDiv.addElementChild(infoDiv);
        cardDiv.addElementChild(nameElement);
        cardDiv.addElementChild(categoryElement);
        cardDiv.addElementChild(descriptionElement);
        precioDiv.addElementChild(DetalleElement);
        precioDiv.addElementChild(buttonElement);
        cardDiv.addElementChild(precioDiv);
        return cardDiv.getElement();
    }
    
    getInfo(carrito = null){        
        const producto = this;

        // Imagen principal
        const mainImage = new ElementBuilder('img')
            .setAttributes({ 
                src: producto.imagen, 
                alt: producto.nombre, 
                class: 'img-thumbnail product-main-image',
                id: 'mainImage'
            });

        // Contenedor de miniaturas
        const thumbnailsContainer = new ElementBuilder('div')
            .setAttributes({ class: 'd-flex flex-wrap galeria-productos mt-2' });

        producto.galeria.forEach((img, index) => {
            const thumbnail = new ElementBuilder('img')
                .setAttributes({
                    src: img,
                    alt: `${producto.nombre} ${index + 1}`,
                    class: `img-thumbnail ${index === 0 ? 'active' : ''}`,
                    'data-index': index
                });

            thumbnail.getElement().addEventListener('click', (e) => {
                // Cambiar la imagen principal
                mainImage.setAttributes({ src: img });
                thumbnailsContainer.getElement().querySelectorAll('img').forEach(th => {
                    th.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
            });

            thumbnailsContainer.addElementChild(thumbnail);
        });

        const imageContent = new ElementBuilder('div')
            .setAttributes({ class: 'col-12 col-md-6' })
            .addElementChild(mainImage)
            .addElementChild(thumbnailsContainer);

        // Información del producto
        const productName = new ElementBuilder('h2')
            .addTextChild(producto.nombre);

        const productCategory = new ElementBuilder('p')
            .addTextChild(`Categoría: ${producto.categoria}`)
            .setAttributes({ class: 'text-muted' });

        const productDescription = new ElementBuilder('p')
            .addTextChild(producto.descripcion);

        const oferta = this.getOferta();
        let productPrice = null;
        if (oferta) {
            productPrice = new ElementBuilder('div').addMultipleElementChild([
                new ElementBuilder('p').setAttributes({ class: 'h3 text-end' }).addMultipleElementChild([
                    new ElementBuilder('span').setAttributes({ class: 'h4 text-muted text-decoration-line-through' }).addTextChild(`$${producto.precio}`),
                    new ElementBuilder('br'),
                    new ElementBuilder('span').setAttributes({ class: 'h3 text-success' }).addTextChild(
                        oferta.tipo == TIPO_2x1 
                        ? `$${this.precio/2} c/u`
                        : `$${oferta.calcularDescuento(this, 1)}`
                    ),
                ]),
                new ElementBuilder('p').setAttributes({ class: 'text-dark' }).addTextChild(`${oferta.descripcion}!`)
            ]);
        }else{
            productPrice = new ElementBuilder('p')
                .addTextChild(`Precio: $${producto.precio}`)
                .setAttributes({ class: 'text-end text-muted h3' });
        }

        // Botón para agregar al carrito
        const buttonElement = new ElementBuilder('button')
            .addTextChild('Agregar al Carrito')
            .setAttributes({ class: 'btn btn-warning w-100 mt-auto' });

        if (carrito && this.stock >= 1) {
            buttonElement.getElement().addEventListener('click', () => {
                carrito.addItem(this);                
                ElementBuilder.closeModal(producto.nombre);
                carrito.toHtml();
            });
        }

        const infoContent = new ElementBuilder('div')
            .setAttributes({ class: 'col-12 col-md-6 d-flex flex-column' })
            .addMultipleElementChild([
                productName,
                productCategory,
                productDescription,
                productPrice,
                buttonElement
            ]);

        // Combinamos ambas columnas
        const rowContent = new ElementBuilder('div')
            .setAttributes({ class: 'row align-items-stretch' })
            .addElementChild(imageContent)
            .addElementChild(infoContent);

        return new ElementBuilder('div').createModal(producto.nombre, rowContent.getElement());
    }

}