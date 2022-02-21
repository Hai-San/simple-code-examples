class SimpleModal {
    constructor() {
        this.body = document.body;

        /**
         * * Property used to indicate when the modal is open
         */
        this.classActive = 'is_active';

        this.createCustomEvents();
    }

    /**
     * * Defines the configuration and elements that will be part of the modal
     * @param {object}
     * @param {string} modalId ID of the main element of the modal
     * @param {string} openSelector ID or Class of the elements that open the modal
     * @param {string} closeSelector ID or Class of the elements that close the modal
     */
    init(
        {
            modalId = 'modal',
            openSelector = '.js_modal_open',
            closeSelector = '.js_modal_close',
            startOpen = false,
        } = {
            modalId: undefined,
            openSelector: undefined,
            closeSelector: undefined,
            startOpen: undefined,
        }
    ) {
        this.modal = document.getElementById(modalId);
        this.buttonOpen = document.querySelectorAll(openSelector);
        this.buttonClose = document.querySelectorAll(closeSelector);
        this.startOpen = startOpen;

        if (this.modal) {
            this.listenerButtons();
            this.addListenerToEscKey();

            if (this.startOpen) {
                this.open();
            }
        } else {
            throw new Error('Modal selector not found');
        }
    }

    /**
     * * Adds the listener event on the modal open and close elements
     */
    listenerButtons() {
        if (this.buttonOpen.length > 0) {
            this.buttonOpen.forEach((button) => {
                button.addEventListener('click', (e) => {
                    this.dispatchEvent(this.modalOpenBefore);
                    this.open();
                });
            });
        }

        if (this.buttonClose.length > 0) {
            this.buttonClose.forEach((button) => {
                button.addEventListener('click', (e) => {
                    this.dispatchEvent(this.modalCloseBefore);
                    this.close();
                });
            });
        }
    }

    /**
     * * Open modal
     */
    open() {
        this.modal.classList.add(this.classActive);
        this.body.style.overflowY = 'hidden';
        this.dispatchEvent(this.modalOpenAfter);
    }

    /**
     * * Close modal
     */
    close() {
        this.modal.classList.remove(this.classActive);
        this.body.style.overflowY = 'auto';
        this.dispatchEvent(this.modalCloseAfter);
    }

    /**
     * * Adds a listener to ESC key to close the modal
     */
    addListenerToEscKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    /**
     * * Create custom events to trigger before and after modal close and open
     */
    createCustomEvents() {
        const target = document.createTextNode(null);
        this.addEventListener = target.addEventListener.bind(target);
        this.removeEventListener = target.removeEventListener.bind(target);
        this.dispatchEvent = target.dispatchEvent.bind(target);

        this.modalOpenBefore = new Event('modal:open:before');
        this.modalOpenAfter = new Event('modal:open:after');
        this.modalCloseBefore = new Event('modal:close:before');
        this.modalCloseAfter = new Event('modal:close:after');
    }
}
