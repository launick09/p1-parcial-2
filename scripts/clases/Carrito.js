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
        const modal = new ElementBuilder('div').setAttributes({ class: 'modal', tabindex: '-1', role: 'dialog' });
        const modalDialog = new ElementBuilder('div').setAttributes({ class: 'modal-dialog', role: 'document' });
        const modalContent = new ElementBuilder('div').setAttributes({ class: 'modal-content' });

        const modalHeader = new ElementBuilder('div').setAttributes({ class: 'modal-header' });
        modalHeader.addElementChild(new ElementBuilder('h5').addTextChild('Carrito'));
        
        const closeButton = new ElementBuilder('button')
            .setAttributes({ type: 'button', class: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' })
            .addElementChild(new ElementBuilder('span').addTextChild('×'));
        modalHeader.addElementChild(closeButton);

        const modalBody = new ElementBuilder('div').setAttributes({ class: 'modal-body' });

        if (this.items.length === 0) {
            modalBody.addTextChild('Tu carrito está vacío.');
        } else {
            const cartList = new ElementBuilder('ul');
            this.items.forEach(item => {
                const listItem = new ElementBuilder('li')
                    .addTextChild(`${item.nombre} - Cantidad: ${item.stock}`);
                cartList.addElementChild(listItem);
            });
            modalBody.addElementChild(cartList);
        }
        const modalFooter = new ElementBuilder('div').setAttributes({ class: 'modal-footer' });
        const closeFooterButton = new ElementBuilder('button')
            .setAttributes({ type: 'button', class: 'btn btn-secondary', 'data-dismiss': 'modal' })
            .addTextChild('Cerrar');
        modalFooter.addElementChild(closeFooterButton);

        modalContent.addElementChild(modalHeader);
        modalContent.addElementChild(modalBody);
        modalContent.addElementChild(modalFooter);
        modalDialog.addElementChild(modalContent);
        modal.addElementChild(modalDialog);

        return modal.getElement();
    }
}