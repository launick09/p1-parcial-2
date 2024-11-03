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
        let modalContent = null;
        if(this.items.length === 0){
            modalContent = 'Tu carrito está vacío. :)';
        }else{
            //TODO: generar lista
            modalContent = this.items.map(item => `${item.producto.nombre} - Cantidad: ${item.cantidad}`);
        }
        const modal = new ElementBuilder('div').createModal('CarritoModal', modalContent)

        return modal;
    }
}