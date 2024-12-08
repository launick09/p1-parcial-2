'use strict';

/**
 * Arroyo Lautaro Alan
 */

import { ElementBuilder } from './ElementBuilder.js';
export class Checkout {
    // para manejar los errores
    #errores = [];
    #valores = [];
    
    constructor(carrito, stock) {
        this.carrito = carrito;
        this.stock = stock;
    }

    toHtml() {
        const formulario = new ElementBuilder('form').setAttributes({ id: 'checkoutForm' });
        formulario.addMultipleElementChild([ 
            new ElementBuilder('div').setAttributes({class:'row'}).addMultipleElementChild([
                this.#generarCampo('Nombre:', 'text', 'name', 'col-md-6 form-group mb-3', {value: this.#valores.nombre || ''}),
                this.#generarCampo('Apellido:', 'text', 'surname', 'col-md-6 form-group mb-3', {value: this.#valores.apellido || ''}),
            ]),
            this.#generarCampo('Correo Electrónico:', 'email', 'mail', 'form-group mb-3', {value: this.#valores.mail || ''}),
            this.#generarCampo('Fecha de Entrega:', 'date', 'date', 'form-group mb-3', {
                min: (new Date()).toISOString().split('T')[0],
                value: this.#valores.date || ''
            }),
            this.#generarCampo('Dirección:', 'text', 'address', 'form-group mb-3', {value: this.#valores.direccion || ''}),
            this.#generarCampo('DNI:', 'number', 'dni', 'form-group mb-3', { min: 0 }, {value: this.#valores.dni || ''}),
            this.#generarCampo('Teléfono:', 'number', 'cel', 'form-group mb-3', { min: 0 }, {value: this.#valores.cel || ''}),

            new ElementBuilder('div').createSelect('Método de Pago:', 'pago', ['Debito', 'Credito', 'Organo'], {value: this.#valores.pago || ''}),
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
        this.#errores = [];
        this.#valores = {
            nombre: document.getElementById('name').value.trim(),
            apellido: document.getElementById('surname').value.trim(),
            direccion: document.getElementById('address').value.trim(),
            date: document.getElementById('date').value.trim(),
            mail: document.getElementById('mail').value.trim(),
            dni: document.getElementById('dni').value.trim(),
            cel: document.getElementById('cel').value.trim(),
            pago: document.getElementById('pago').value
        }

        //usar logica de laravel
        if (!this.#valores.nombre) this.#errores.name = 'El nombre es obligatorio.';
        if (!this.#valores.apellido) this.#errores.surname = 'El apellido es obligatorio.';
        if (!this.#valores.mail) this.#errores.mail = 'El Correo Electronico es obligatorio.';
        if (!this.#valores.direccion) this.#errores.address = 'La dirección es obligatoria.';
        if (!this.#valores.date) this.#errores.date = 'La fecha es obligatoria.';
        if (!this.#valores.dni) this.#errores.dni = 'El DNI es obligatorio.';
        if (!this.#valores.cel) this.#errores.cel = 'El DNI es obligatorio.';

        if (Object.keys(this.#errores).length > 0) {
            this.toHtml();
            return;
        }

        ElementBuilder.closeModal('Finalizar Compra');
        this.carrito.clear();
        this.compraExitosa(this.#valores);
    }

    compraExitosa(valores) {
        const contenido = new ElementBuilder('div').addMultipleElementChild([
            new ElementBuilder('p').addTextChild(`
                ¡Gracias por tu compra, ${valores.nombre}!
            `).setAttributes({ class: 'h5'}),
            new ElementBuilder('p').addTextChild(`Tu pedido será enviado a: ${valores.direccion} el dia ${valores.date}`),
            new ElementBuilder('p').addTextChild(`Método de pago: ${valores.pago}`),
            new ElementBuilder('p').addTextChild(`¡Gracias por confiar en nuestros servicios! te hemos enviado un mail con el comprobante!`)
                .setAttributes({
                    class: 'text-center text-muted mt-4',
                    style: 'font-size: 0.8rem'
                }),
            
        ]);


        new ElementBuilder().createModal('Compra Exitosa!', contenido.getElement());
    }

    #generarCampo(label, type, id, classes = '', atributos = {}) {
        const contenido = new ElementBuilder('div').setAttributes({ class: classes });
        const input = new ElementBuilder('div').createInput(label, type, id, atributos );
        const error = this.#errores[id] 
            ? new ElementBuilder('div').addTextChild(`* ${this.#errores[id]}`).setAttributes({ class: 'text-danger small mt-1' })
            : null;

        contenido.addMultipleElementChild([
            input,
            error ? error : null
        ]);


        return contenido;
    }
}