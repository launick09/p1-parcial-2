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
    esValida(producto) {
        const Categoria = this.categorias.includes(producto.categoria);
        const Producto = this.productos.includes(producto.id);
        return Categoria || Producto;
    }

    /**
     * Calcula el descuento aplicable a un producto y cantidad.
     * @param {Object} producto - El producto a evaluar (debe tener `precio`).
     * @param {number} cantidad - La cantidad del producto.
     * @returns {number} - El monto del descuento aplicado.
     */
    calcularDescuento(producto, cantidad) {
        if (!this.esValida(producto)) return producto.precio * cantidad;

        switch (this.tipo) {
            case 'PORCENTAJE':
                return (producto.precio * cantidad * this.valor) / 100;
            case 'CANTIDAD_FIJA':
                return Math.min(this.valor * cantidad, producto.precio * cantidad);
            case '2x1':
                let precio = 0;
                if(cantidad % 2 == 0){
                    precio = cantidad / 2 * producto.precio;
                }else{
                    precio = (Math.floor(cantidad / 2) * producto.precio) + producto.precio;
                }
                return precio;
            default:
                return producto.precio * cantidad;
        }
    }
}