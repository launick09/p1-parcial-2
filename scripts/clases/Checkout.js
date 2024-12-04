'use strict';

/**
 * Arroyo Lautaro Alan
 */

import { ElementBuilder } from './ElementBuilder.js';
export class Checkout {
    constructor(carrito) {
        this.carrito = carrito;
    }

    toHtml() {
        const formulario = new ElementBuilder('form').setAttributes({ id: 'checkoutForm' });

        formulario.addMultipleElementChild([ 
            new ElementBuilder('div').createInput('Nombre:', 'text', 'name'),
            new ElementBuilder('div').createInput('Apellido:', 'text', 'surname'),
            new ElementBuilder('div').createInput('Dirección:', 'text', 'address'),
            new ElementBuilder('div').createInput('DNI:', 'number', 'dni', {min: 0}),
        ]);

        formulario.addElementChild(
            new ElementBuilder('button').addTextChild('Confirmar Compra').setAttributes({ type: 'submit', class: 'btn btn-success' })
        );

        formulario.getElement().addEventListener('submit', (e) => {
            e.preventDefault();
            this.procesarCompra();
        });

        new ElementBuilder().createModal('Finalizar Compra', formulario.getElement());
    }

    procesarCompra() {
        const nombre = document.getElementById('name').value.trim();
        const apellido = document.getElementById('surname').value.trim();
        const direccion = document.getElementById('address').value;
        const dni = document.getElementById('dni').value;

        if (!nombre || !apellido || !direccion || !dni) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        ElementBuilder.closeModal('Finalizar Compra');
        this.carrito.clear();
        this.compraExitosa(nombre, direccion);
    }

    compraExitosa(nombre, direccion) {
        const contenido = new ElementBuilder('p').addTextChild(`
            ¡Gracias por tu compra, ${nombre}!\n
            Tu pedido será enviado a: ${direccion}\n
        `).setAttributes({ class: 'h5'});
        new ElementBuilder().createModal('Compra Exitosa!', contenido.getElement());
    }
}