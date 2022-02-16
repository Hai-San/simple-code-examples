/**
 * * Used to force TAB navigation within a specific area
 * ex: modals, menus
 */
class TabNavigationArea {
    constructor() {
        /**
         * * This property stores all types of focusable elements.
         */
        this.focusabledElements = [
            '[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])',
        ];

        /**
         * * Property used to indicate when the stuck function is active
         */
        this.classActive = 'is_stuck';

        this.createCustomEvents();
    }

    /**
     * * Defines the configuration and elements that will be part of the navigation area
     * @param containerId Main element ID of custom navigation area
     * @param buttonEnterId Button ID used to enter the navigation area (Optional)
     * @param buttonExitId Button ID used to exit the navigation area (Optional)
     * @param focusOnEnterId ID of the element within the navigation area that should be focused when the lock starts. (Optional)
     * @param focusOnExitId ID of the element outside the navigation area that should be focused when the lock ends (Optional)
     */
    init(
        {
            containerId = 'focusTrap_container',
            buttonEnterId = '[data-start-tab-area]',
            buttonExitId = '[data-close-tab-area]',
            focusOnEnterId = '[data-start-focus]',
            focusOnExitId = '[data-end-focus]',
        } = {
            containerId: undefined,
            buttonEnterId: undefined,
            buttonExitId: undefined,
            focusOnEnterId: undefined,
            focusOnExitId: undefined,
        }
    ) {
        this.container = document.getElementById(containerId);
        this.buttonEnter = document.getElementById(buttonEnterId);
        this.buttonExit = document.getElementById(buttonExitId);
        this.elementFocusOnEnter = document.getElementById(focusOnEnterId);
        this.elementFocusOnExit = document.getElementById(focusOnExitId);

        this.createEnterButtonListener();
        this.createExitButtonListener();
    }

    /**
     * * Create a listener for the enter button
     */
    createEnterButtonListener() {
        if (this.buttonEnter) {
            this.buttonEnter.addEventListener('click', (event) => {
                this.enterArea();
            });
        }
    }

    /**
     * * Create a listener for the exit button
     */
    createExitButtonListener() {
        if (this.buttonExit) {
            this.buttonExit.addEventListener('click', (event) => {
                this.exitArea();
            });
        }
    }

    /**
     * * Method used to enter the custom navigation area
     */
    enterArea() {
        this.dispatchEvent(this.eventBeforeEnterArea);

        this.container.classList.add(this.classActive);
        this.getFocusalbeNodes();

        if (this.elementFocusOnEnter) {
            this.elementFocusOnEnter.focus();
        } else {
            [this.elementFocusOnEnter = [0]] = this.focusableElements;
        }
    }

    /**
     * * Method used to exit the custom navigation area
     */
    exitArea() {
        this.dispatchEvent(this.eventBeforeExitArea);

        this.container.classList.remove(this.classActive);

        if (this.elementFocusOnExit) {
            this.elementFocusOnExit.focus();
        }
    }

    /**
     * * Grabs all elements within the area that can be focused
     */
    getFocusalbeNodes() {
        this.focusableElements = this.container.querySelectorAll(this.focusabledElements);
        this.lengthOfFocusableElements = this.focusableElements.length;

        if (this.hasFocusableElements() && this.getNavigationStatus()) {
            this.setFirstFocusElement();
            this.setLastFocusElement();
            this.tabNavigationControl();
        }
    }

    /**
     * * Sets the first focusable element within the navigation area
     */
    setFirstFocusElement() {
        [this.firstElement = [0]] = this.focusableElements;
    }

    /**
     * * Sets the last element that can be focused within the navigation area
     */
    setLastFocusElement() {
        this.lastElement = this.focusableElements[this.lengthOfFocusableElements - 1];
    }

    /**
     * * Controls the navigation of the TAB key when inside an active navigation area
     */
    tabNavigationControl() {
        this.container.addEventListener('keydown', (e) => {
            if (this.getNavigationStatus()) {
                if (e.key === 'Tab') {
                    if (e.target === this.firstElement && e.shiftKey === true) {
                        e.preventDefault();
                        this.lastElement.focus();
                    } else if (e.target === this.lastElement && e.shiftKey === false) {
                        e.preventDefault();
                        this.firstElement.focus();
                    }
                } else if (e.key === 'Escape') {
                    this.exitArea();
                }
            }
        });
    }

    /**
     * * Checks if there are elements that can be focused
     * @returns boolean
     */
    hasFocusableElements() {
        return this.lengthOfFocusableElements > 0;
    }

    /**
     * * Checks if the navigation area is active
     * @returns boolean
     */
    getNavigationStatus() {
        return this.container.classList.contains(this.classActive);
    }

    /**
     * * Create custom events to trigger before and after modal enter and exit
     */
    createCustomEvents() {
        const target = document.createTextNode(null);
        this.addEventListener = target.addEventListener.bind(target);
        this.removeEventListener = target.removeEventListener.bind(target);
        this.dispatchEvent = target.dispatchEvent.bind(target);

        this.eventBeforeEnterArea = new Event('area:enter:before');
        this.eventBeforeExitArea = new Event('area:exit:before');
    }
}
