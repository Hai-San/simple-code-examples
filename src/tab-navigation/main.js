/**
 * * This component allows you to create a navigation structure between TABs.
 */
class TabNavigation {
    constructor() {
        this.createCustomEvents();

        /**
         * * Object that contains classes used to control certain component conditions
         */
        this.statusClasses = {
            active: 'is_active',
            loading: {
                active: 'is_loading',
                finished: 'is_loaded',
            },
        };
    }

    /**
     * * Starts the component according to the parameters that were passed
     * @param {object}
     * @param {string} containerSelector ID of the main container that encloses all elements of the TAB navigation component
     * @param {string} startTabId ID of the tab that will be active when the component starts
     */
    init(
        { containerSelector = '#tabNav', startTabId = '' } = {
            containerSelector: undefined,
            startTabId: undefined,
        }
    ) {
        this.containerSelector = containerSelector;
        this.startTabId = startTabId;

        this.tabButtons = document.querySelectorAll(`${this.containerSelector} [role="tab"]`);
        this.tabMenuScrollContainer = document.querySelector(
            `${this.containerSelector} .js_tabNav_scrollArea`
        );

        if (this.tabButtons.length > 0) {
            this.getLoadingElement();
            this.setStartTab();
            this.findActiveTab();
            this.addTabListener();
            this.addArrowNavigationListener();
        }
    }

    getLoadingElement() {
        this.loadingElement = document.querySelector(
            `${this.containerSelector} .js_tabNav_loading`
        );

        if (this.loadingElement) {
            this.loadingElement.remove();
        }
    }

    /**
     * * Sets the tab that will start active when the page loads. (If there is an active URL Hash, the Hash Tab will prevail)
     */
    setStartTab() {
        if (this.startTabId) {
            this.startTab = document.getElementById(this.startTabId);
        } else {
            [this.startTab] = this.tabButtons;
        }
    }

    /**
     * * Add listen events to tab navigation buttons
     */
    addTabListener() {
        this.tabButtons.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                if (!tab.classList.contains(this.statusClasses.active)) {
                    this.setNewActiveTab(tab);
                }
            });
        });
    }

    /**
     * * Deactivates the previously active tab.
     */
    disableOldTab(newTab) {
        const oldTab = document.querySelector(`${this.containerSelector} [aria-selected="true"]`);

        if (oldTab) {
            this.eventTabChangeStart.data = {
                oldTab,
                newTab,
            };
            this.dispatchEvent(this.eventTabChangeStart);

            const oldTabPanel = this.getTabPanel(oldTab);

            oldTab.classList.remove(this.statusClasses.active);
            oldTab.setAttribute('aria-selected', false);
            oldTabPanel.classList.remove(this.statusClasses.active);
        }
    }

    /**
     * * Mark the tab that is active and show its respective panel.
     * @param {*} tab
     */
    setNewActiveTab(tab) {
        this.disableOldTab(tab);

        const tabPanel = this.getTabPanel(tab);

        this.tabNavHorizontalScroll(tab);

        tabPanel.classList.add(this.statusClasses.active);
        tab.classList.add(this.statusClasses.active);
        tab.setAttribute('aria-selected', true);

        this.setUrlHash(tab.id);

        if (this.getLoadingCondition(tab)) {
            this.showLoading(tab);
        } else {
            /**
             * * Fires the custom event after the tab has been activated
             */
            this.eventTabChangeEnd.data = tab;
            this.dispatchEvent(this.eventTabChangeEnd);
        }
    }

    /**
     * * Checks the conditions to show the element that indicates loading.
     * @param {HTMLButtonElement} tab
     * @return {Boolean}
     */
    getLoadingCondition(tab) {
        return !!(
            tab.dataset.load &&
            this.loadingElement &&
            !tab.classList.contains(this.statusClasses.loading.finished) &&
            !tab.classList.contains(this.statusClasses.loading.active)
        );
    }

    /**
     * * Hide the element that indicates that the content of the tab is loading
     */
    hideLoading(tab = undefined) {
        if (tab) {
            tab.classList.remove(this.statusClasses.loading.active);
            tab.classList.add(this.statusClasses.loading.finished);

            /**
             * * Fires the custom event after the tab has been activated
             */
            this.eventTabChangeEnd.data = tab;
            this.dispatchEvent(this.eventTabChangeEnd);
        }

        this.loadingElement.classList.remove(this.statusClasses.active);
        this.loadingElement.remove();
    }

    /**
     * * Shows the element that indicates that the content of the tab is loading
     */
    showLoading(tab) {
        if (tab) {
            tab.classList.add(this.statusClasses.loading.active);

            const tabPanel = this.getTabPanel(tab);

            tabPanel.appendChild(this.loadingElement);
            this.loadingElement.classList.add(this.statusClasses.active);
        }
    }

    /**
     * * Returns the panel of a tab using the aria controls attribute of the active tab as the panel ID
     * @param {HTMLButtonElement} tab
     * @returns {HTMLSpanElement}
     */
    getTabPanel(tab) {
        return document.getElementById(tab.getAttribute('aria-controls'));
    }

    /**
     * * Finds which Tab should be marked as active
     */
    findActiveTab() {
        let tab = this.startTab;

        if (this.getURLHash()) {
            tab = this.getTabByURLHash();
        }

        this.setNewActiveTab(tab);
    }

    /**
     * * Return the tab using the Hash inserted in the URL
     * @returns {HTMLButtonElement}
     */
    getTabByURLHash() {
        return document.querySelector(`${this.containerSelector} ${this.getURLHash()}`);
    }

    /**
     * * Returns the hash that is active in the URL if it exists.
     * @returns string
     */
    getURLHash() {
        return window.location.hash;
    }

    /**
     * * Insert the Hash of the active tab in the URL
     * @param {string} tabId
     */
    setUrlHash(tabId) {
        window.history.replaceState(
            '',
            document.title,
            `${window.location.origin}${window.location.pathname}#${tabId}`
        );
    }

    /**
     * * Allows navigation between tab buttons using the left and right arrows.
     */
    addArrowNavigationListener() {
        const tabList = document.querySelector(`${this.containerSelector} [role="tablist"]`);

        if (tabList) {
            tabList.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const firstTab = tabList.firstElementChild;
                    const lastTab = tabList.lastElementChild;
                    const currentTab = document.querySelector(
                        `${this.containerSelector} [aria-selected="true"]`
                    );
                    const nextTab = currentTab.nextElementSibling;
                    const prevTab = currentTab.previousElementSibling;

                    if (e.target !== currentTab) {
                        currentTab.focus();
                    } else if (e.key === 'ArrowRight') {
                        if (nextTab) {
                            nextTab.focus();
                            nextTab.click();
                        } else {
                            firstTab.focus();
                            firstTab.click();
                        }
                    } else if (e.key === 'ArrowLeft') {
                        if (prevTab) {
                            prevTab.focus();
                            prevTab.click();
                        } else {
                            lastTab.focus();
                            lastTab.click();
                        }
                    }
                    e.preventDefault();
                }
            });
        }
    }

    /**
     * * According to the screen size, a scroll of navigation buttons is created. That way we have a fully responsive menu.
     */
    tabNavHorizontalScroll(tab) {
        const tabRect = tab.getBoundingClientRect();
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const scrollSize =
            tabRect.width - (screenWidth - tabRect.x) + (screenWidth - tabRect.width) / 2;

        const scrollX = this.tabMenuScrollContainer.scrollLeft + scrollSize;

        this.tabMenuScrollContainer.scrollTo({
            top: 0,
            left: scrollX,
            behavior: 'smooth',
        });
    }

    /**
     * * Create custom events to trigger before and after tab change
     */
    createCustomEvents() {
        const target = document.createTextNode(null);
        this.addEventListener = target.addEventListener.bind(target);
        this.removeEventListener = target.removeEventListener.bind(target);
        this.dispatchEvent = target.dispatchEvent.bind(target);

        this.eventTabChangeStart = new Event('tabChange:start');
        this.eventTabChangeEnd = new Event('tabChange:end');
    }
}
