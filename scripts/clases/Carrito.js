'use strict';

/**
 * Arroyo Lautaro Alan
 * Adaptacion de Discografia, del parcial 1
 */

import { ElementBuilder } from './ElementBuilder.js';
import { Producto } from './Producto.js';
import { Checkout } from './Checkout.js';

export class Carrito {
    constructor() {
        this.items = [];
    }

    /**
     * Agrega un producto al carrito.
     * Si el producto ya está en el carrito, aumenta la cantidad.
     * @param {Producto} producto - Producto a agregar.
     * @param {Number} cantidad - Cantidad a agregar.
     */
    addItem(producto, cantidad = 1) {
        const itemIndex = this.items.findIndex(item => item.producto.id === producto.id);
        if (itemIndex >= 0) {
            let productoAgregado = this.items[itemIndex];
            if (producto.stock < productoAgregado.cantidad + cantidad) {
                new ElementBuilder('div').alert(`Stock insuficiente para ${producto.nombre}. ${producto.stock} unidades disponibles.`);
                return;
            }            
            productoAgregado.cantidad += cantidad;
        } else {
            if (producto.stock < cantidad) {
                new ElementBuilder('div').alert(`Stock insuficiente para ${producto.nombre}. ${producto.stock} unidades disponibles.`);
                return;
            }
            this.items.push({ producto, cantidad });
        }
        this.calcularCantidad();
        this.agregarALocalStorage();
    }

    calcularCantidad() {
        const carrito = document.getElementById('comprar-cantidad');        
        if(this.getCantidad()){
            carrito.classList.remove('d-none');
            carrito.querySelector('span').innerText = this.getCantidad();
        }else{
            carrito.classList.add('d-none');
        }
        
    }

    /**
     * remueve un producto al carrito.
     * Si el producto ya está en el carrito, aumenta la cantidad.
     * @param {Producto} producto - Producto a remover.
     * @param {Number} cantidad - Cantidad a remover.
     */
    removeItem(producto, cantidad = 1) {
        const itemIndex = this.items.findIndex(item => item.producto.id === producto.id);
        if (itemIndex >= 0) {
            let productoAgregado = this.items[itemIndex];
            if (cantidad === null) {
                this.items.splice(itemIndex, 1);
            } else {
                productoAgregado.cantidad -= cantidad;
                if (productoAgregado.cantidad <= 0) {
                    this.items.splice(itemIndex, 1);
                }
            }
        } else {
            throw new Error(`El producto ${producto.nombre} no está en el carrito.`);
        }
        this.calcularCantidad();
        this.agregarALocalStorage();
    }

    /**
     * Vacia el carrito
     */
    clear() {
        this.items = [];
        this.agregarALocalStorage();
        this.calcularCantidad();
    }

    /**
     * Obtiene cuanto hay que pagar.
     * @returns {Number} - Precio total.
     */
    getTotal() {
        return this.items.reduce((total, item) => total + item.producto.obtenerPrecioConDescuento(item.cantidad), 0);
    }

    getCantidad(){
        return this.items.reduce((total, item) => total + item.cantidad, 0);
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

                const productName = new ElementBuilder('p')
                    .addTextChild(item.producto.nombre)
                    .setAttributes({ class: 'fw-bold h5' });

                const increaseButton = new ElementBuilder('button').setAttributes({ 
                    class: 'btn btn-outline-dark btn-sm increase-btn', 
                    'aria-data-id': item.producto.id 
                });
                increaseButton.addElementChild(
                    new ElementBuilder('i').setAttributes({ class: 'fas fa-plus' }).getElement()
                );
                increaseButton.getElement().addEventListener('click', () => this.addItem(item.producto, 1));

                const decreaseButton = new ElementBuilder('button')
                    .setAttributes({
                        class: 'btn btn-outline-dark btn-sm decrease-btn', 
                        'aria-data-decrease-id': item.producto.id 
                    });
                decreaseButton.addElementChild(
                    new ElementBuilder('i').setAttributes({ class: 'fas fa-minus' }).getElement()
                );
                decreaseButton.getElement().addEventListener('click', () => this.removeItem(item.producto, 1));

                const removeButton = new ElementBuilder('button')
                    .setAttributes({ 
                        class: 'btn btn-outline-dark btn-sm remove-btn', 
                        'aria-data-delete-id': item.producto.id 
                    });
                removeButton.addElementChild(
                    new ElementBuilder('i').setAttributes({ class: 'fas fa-trash' }).getElement()
                );
                removeButton.getElement().addEventListener('click', () => this.removeItem(item.producto, null));

                //volver a generar el modal
                [decreaseButton, removeButton, increaseButton].forEach(button => 
                    button.getElement().addEventListener('click', () => this.toHtml())
                );

                const buttonsContent = new ElementBuilder('div')
                    .setAttributes({ class: 'btn-group justify-self-end' })
                    .addMultipleElementChild([
                        decreaseButton,
                        removeButton,
                        increaseButton
                    ])

                const Oferta = item.producto.getOferta();
                const tieneOferta = Oferta ? Oferta.esValida(item.producto, item.cantidad) : false;   

                const productPrice = new ElementBuilder('div').addMultipleElementChild([
                    new ElementBuilder('p')
                        .addTextChild(`${item.cantidad} ${item.cantidad >= 2 ? 'unidades X ' : 'unidad'}. $${item.producto.precio} .`)
                        .setAttributes({ class: 'text-primary text-end' }), 
                    //si el producto tiene oferta y la oferta es mayor a 0, por problemas con el 2x1 
                    tieneOferta 
                        ? new ElementBuilder('p')
                            .addTextChild(`${item.producto.getOferta().descripcion} - $${ Oferta.calcularDescuento(item.producto, item.cantidad) }.`)
                            .setAttributes({ class: 'text-success text-end' })
                        : null
                ])


                let productTotal = null;
                if(item.cantidad >= 2 || tieneOferta){
                    productTotal = new ElementBuilder('p')
                        .addTextChild(`Total: $${item.producto.obtenerPrecioConDescuento(item.cantidad)}.`)
                        .setAttributes({ class: 'text-primary fw-bold text-end' });
                }

                const modalContent = new ElementBuilder('div')
                    .setAttributes({class: 'col-9 col-md-10 m-auto'}).addMultipleElementChild([
                        productName,
                        buttonsContent,
                        productPrice,
                        productTotal ?? null
                    ])

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


            listItems.push(Row.getElement());
            const content = new ElementBuilder('div').createList(listItems, 'ul');

            const vaciarBtn = new ElementBuilder('button')
                .setAttributes({ type: "button", class: "btn btn-outline-warning my-2 me-4"})
                .addTextChild('Vaciar Carrito');

            vaciarBtn.getElement().addEventListener('click', () => {
                this.clear();
                this.toHtml();
            });

            const comprarBtn = new ElementBuilder('button')
                .setAttributes({ type: "button", class: "btn btn-warning my-2"})
                .addTextChild('Comprar!');

            comprarBtn.getElement().addEventListener('click', () => {
                ElementBuilder.closeModal('Mi Carrito');
                const checkout = new Checkout(this);
                checkout.toHtml();  
            });

            modalContent = new ElementBuilder('div')
                .addElementChild(content)
                .addElementChild(vaciarBtn)
                .addElementChild(comprarBtn)
                .getElement();

        }
        const modal = new ElementBuilder('div').createModal('Mi Carrito', modalContent);
    
        return modal;
    }

    agregarALocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    cargarDesdeLocalStorage(listado) {
        try {
            const data = JSON.parse(localStorage.getItem('carrito'));
            if (Array.isArray(data)) {
                this.items = data.filter(item => {
                    const producto = listado.productos.find(p => p.id === item.producto.id);
                    if (!producto) {
                        return false;
                    }
                    item.producto = producto;
                    return true;
                });
            }
        } catch (error) {
            console.error("Error al cargar desde localStorage:", error);
        }
    }

    procesarCompra(){
        this.items.forEach(producto => {
            producto.producto.removerStock(producto.cantidad);
        });
        this.clear();
    }
}