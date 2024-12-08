'use strict';

/*
 * Arroyo Lautaro Alan
 */

export const TIPO_PORCENTAJE = 'PORCENTAJE';
export const TIPO_CANTIDAD_FIJA = 'CANTIDAD_FIJA';
export const TIPO_2x1 = '2x1';

/**
 * @class Oferta
 * @param {number} id
 * @param {string} tipo - Tipo de oferta (PORCENTAJE, CANTIDAD_FIJA, 2x1).
 * @param {number} valor - Valor del descuento.
 * @param {Array<string>} categorias - Categorías a las que aplica el descuento.
 * @param {Array<number>} productos - en caso de aplciar.
 * @param {string} descripcion - Descripción.
*/
export class Oferta {
    
    constructor(id, tipo, valor, categorias = [], productos = [], descripcion = '') {
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;
        this.categorias = categorias;
        this.productos = productos;
        this.descripcion = descripcion;
    }

    /**
     * Verifica si la oferta es válida para un producto.
     * @param {Object} producto - El producto.
     * @returns {boolean} - Tiene oferta.
     */
    esValida(producto, cantidad = 2) {
        const Categoria = this.categorias.includes(producto.categoria);
        const Producto = this.productos.includes(producto.id);
        if(this.tipo == TIPO_2x1 && cantidad <= 1){
            return false;
        }
        return Categoria || Producto;
    }

    /**
     * Calcula el descuento aplicable a un producto y cantidad.
     * @param {Object} producto - El producto a evaluar (debe tener `precio`).
     * @param {number} cantidad - La cantidad del producto.
     * @returns {number} - El monto del descuento aplicado.
     */
    calcularDescuento(producto, cantidad) {
        if (!this.esValida(producto, cantidad)) {
            return 0
        };

        switch (this.tipo) {
            case 'PORCENTAJE':
                return (producto.precio * cantidad * this.valor) / 100;
            case 'CANTIDAD_FIJA':
                const descuento = this.valor * cantidad;
                return descuento < 0 ? producto.precio * cantidad : descuento;
            case '2x1':
                const descuento2 = Math.floor(cantidad / 2); //xD
                return descuento2 * producto.precio;
            default:
                return 0;
        }
    }
}