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

     /**
     * crea un modal con titulo y contenido.
     * @param {string} titulo - el titulo del modal.
     * @param {HTMLElement | string} contenido - el contenido.
     * @returns {HTMLElement} -El modal.
     */
    createModal(titulo = 'modal', contenido) {
        const modalId = titulo.toLowerCase().replace(' ', '-');
        const modal = new ElementBuilder('div').setAttributes({
            class: 'modal fade',
            id: modalId,
            'aria-labelledby': modalId + "Label",
            'data-bs-backdrop': "static",
            'data-bs-keyboard': "false"
        });

        const modalDialog = new ElementBuilder('div').setAttributes({ class: 'modal-dialog modal-lg' });
        const modalContent = new ElementBuilder('div').setAttributes({ class: 'modal-content' });
        // header
        const modalHeader = new ElementBuilder('div').setAttributes({ class: 'modal-header' });
        modalHeader.addElementChild(new ElementBuilder('h5').addTextChild(titulo)).setAttributes({
            id: modalId + "Label",
            class: "modal-title d-flex justify-content-between container py-2"
        });
        // contenido
        const closeButton = new ElementBuilder('button')
            .setAttributes({ type: "button", class: "btn-close", 'data-bs-dismiss': "modal" })
            .addElementChild(new ElementBuilder('span').addTextChild(''));

        modalHeader.addElementChild(closeButton);

        const modalBody = new ElementBuilder('div').setAttributes({ class: 'modal-body' });
        if (typeof contenido === 'string') {
            modalBody.addTextChild(contenido);
        } else if (contenido instanceof HTMLElement) {
            modalBody.addElementChild(contenido);
        }
        // footer
        const modalFooter = new ElementBuilder('div').setAttributes({ class: 'modal-footer' });
        const closeFooterButton = new ElementBuilder('button')
            .setAttributes({ type: "button", class: "btn btn-warning", 'data-bs-dismiss': "modal" })
            .addTextChild('Cerrar');

        modalFooter.addElementChild(closeFooterButton);

        modalContent.addElementChild(modalHeader);
        modalContent.addElementChild(modalBody);
        modalContent.addElementChild(modalFooter);
        modalDialog.addElementChild(modalContent);
        modal.addElementChild(modalDialog);

        
        // que dolor de cabeza
        // lo saque de aca: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript

        document.body.appendChild(modal.getElement());
        const modalInstance = new bootstrap.Modal(modal.getElement());
        modalInstance.show();

        return modal.getElement();
    }

    /**
     * 
     * @param {Array<string | HTMLElement>} contenido - un array con los elementos
     * @param {string} list - define tipo de lista
     * @returns {HTMLElement} - la lista
     */
    createList(contenido, list = 'ul') {
        const listElement = new ElementBuilder(list).setAttributes({class:'list-group'});
        contenido.forEach(item => {
            const listItem = new ElementBuilder('li').setAttributes({class:'list-group-item'});
            if (typeof item == 'string') {
                listItem.textContent = item;
            } else if (item instanceof HTMLElement) {
                console.log(listItem);
                listItem.addElementChild(item);
            }
            listElement.addElementChild(listItem);
        });
        return listElement;
    }
}