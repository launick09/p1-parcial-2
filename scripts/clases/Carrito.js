'use strict';

/**
 * Arroyo Lautaro Alan
 * Adaptacion de Discografia, del parcial 1
 */

import { ElementBuilder } from './ElementBuilder.js';

export class Carrito {
    constructor() {
        this.items = [];
    }

    /**
     * Agrega un producto al carrito.
     * Si el producto ya está en el carrito, aumenta la cantidad.
     * @param {Producto} producto - Producto a agregar.
     * @param {Number} cantidad - Cantidad a agregar.
     * @returns {Boolean} - `true` si se pudo agregar, `false` si excede el stock permitido.
     */
    addItem(producto, cantidad = 1) {
        
        const itemIndex = this.items.findIndex(item => item.producto.id === producto.id);
        if (itemIndex >= 0) {
            let productoAgregado = this.items[itemIndex];
            if (producto.stock < productoAgregado.cantidad + cantidad) {
                throw new Error(`Stock insuficiente para ${producto.nombre}. ${producto.stock} unidades disponibles.`);
            }
            return productoAgregado.cantidad += cantidad;
        } else {
            if (producto.stock < cantidad) {
                throw new Error(`Stock insuficiente para ${producto.nombre}. ${producto.stock} unidades disponibles.`);
            }
            this.items.push({ producto, cantidad });
            return true;
        }
    }

    /**
     * Elimina un producto del carrito.
     * @param {Number} productId - ID del producto a eliminar.
     */
    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.producto.id === productId);
        if (itemIndex >= 0) {
            this.items.splice(itemIndex, 1);
        }
    }

    /**
     * Obtiene cuanto hay que pagar.
     * @returns {Number} - Precio total.
     */
    getTotal() {
        return this.items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
    }

    getCantidad(){
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    /**
     * Vacia el carrito
     */
    clear() {
        this.items = [];
    }

    /**
     * Muestra el contenido del carrito.
     * @returns {Array} - Lista de productos en el carrito con detalles de cantidad y precio.
     */
    toHtml() {
        let modalContent;
    
        if (this.items.length === 0) {
            modalContent = 'Tu carrito está vacío. :)';
        } else {
            const listItems = this.items.map(item => {
                const productImage = new ElementBuilder('img')
                    .setAttributes({ src: item.producto.imagen, alt: item.producto.nombre, class: 'img-fluid mb-3' });

                const productName = new ElementBuilder('h3')
                    .addTextChild(item.producto.nombre)
                    .setAttributes({ class: 'fw-bold h5' });

                const productPrice = new ElementBuilder('p')
                    .addTextChild(`${item.cantidad} ${item.cantidad >= 2 ? 'unidades' : 'unidad'}. $${item.producto.precio}.`)
                    .setAttributes({ class: 'text-primary text-end' });

                let productTotal = null;
                if(item.cantidad >= 2){
                    productTotal = new ElementBuilder('p')
                        .addTextChild(`Total: $${item.producto.precio * item.cantidad}.`)
                        .setAttributes({ class: 'text-primary fw-bold text-end' });
                }

                const modalContent = new ElementBuilder('div')
                    .setAttributes({class: 'col-9 col-md-10 m-auto'})
                    .addElementChild(productName)
                    .addElementChild(productPrice)
                    .addElementChild(productTotal ?? '')
                const imgContent = new ElementBuilder('div')
                    .setAttributes({class: 'col-3 col-md-2'})
                    .addElementChild(productImage)

                const rowContent = new ElementBuilder('div')
                    .setAttributes({class: 'row'})
                    .addElementChild(imgContent)
                    .addElementChild(modalContent)
                
                return rowContent.getElement();
            });

            const totalTitle = new ElementBuilder('p')
                .addTextChild('Facturación:')
                .setAttributes({ class: 'fw-bold h5 my-0' });

            const priceTotal = new ElementBuilder('p')
                .addTextChild(`${this.getCantidad()} ${this.getCantidad() >= 2 ? 'unidades' : 'unidad'}. Total: $${this.getTotal()}`)
                .setAttributes({ class: 'text-primary h5 text-end my-0' });

            const Row = new ElementBuilder('div')
                .setAttributes({ class: 'd-flex justify-content-between my-1' })
                .addElementChild(totalTitle)
                .addElementChild(priceTotal);

            // extraño el innerHtml :(

            listItems.push(Row.getElement());

            modalContent = new ElementBuilder('div').createList(listItems, 'ul').getElement();
        }
        const modal = new ElementBuilder('div').createModal('Carrito', modalContent);
    
        return modal;
    }
}