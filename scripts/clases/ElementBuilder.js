'use strict';

/*
 * Arroyo Lautaro Alan
 */


/**
 * Helper para crear elementos HTML
 * 
 * Métodos:
 * - constructor(tag): Crea un nuevo elemento HTML con la etiqueta especificada.
 * - setAttributes(atributos): Establece atributos en el elemento creado.
 * - addTextChild(texto): Agrega texto como hijo del elemento.
 * - addElementChild(hijo): Agrega otro elemento como hijo del elemento actual.
 * - getElement(): Devuelve el elemento.
 */

export class ElementBuilder {

    /**
     * crea el elemento Html, si el tag es invalido, crea un div
     * @param {String} tag - un string con la etiqueta.
     * @returns { HTMLElement } - elemento Html.
     */
    constructor(tag) {
        try {
            this.elemento = document.createElement(tag);
        } catch (error) {
            console.warn('Elemento Inesperado. creando div');
            this.elemento = document.createElement('div');
        }
    }

    /**
     * Agrega atributos al elemento.
     * @param {Object} atributos - un Array donde las keys son los atributos y los valores los valores.
     * @returns {ElementBuilder} - elemento Html con atributos.
     */
    setAttributes(atributos) {
        for (const [key, value] of Object.entries(atributos)) {
            try {
                this.elemento.setAttribute(key, value);
            } catch (error) {
                console.warn(`atributo no valido: ${error}`)
            }
        }
        return this;
    }

    /**
     * @param {String} texto 
     * @returns {ElementBuilder} - elemento con hijo
     */
    addTextChild(texto) {
        this.elemento.appendChild(document.createTextNode(texto));
        return this;
    }

    /**
     * 
     * @param {ElementBuilder} hijo 
     * @returns {ElementBuilder} - elemento con hijo
     */
    addElementChild(hijo) {        
        if (hijo instanceof ElementBuilder) {
            this.elemento.appendChild(hijo.getElement());
        } else if (hijo instanceof HTMLElement) {
            this.elemento.appendChild(hijo);
        }
        return this;
    }

    /**
     * @returns - Elemento
     */
    getElement() {
        return this.elemento;
    }
}