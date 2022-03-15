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

        this.tabButtons = document.querySelectorAll(`${this.containerSelector} [role="tab"]`);
        this.tabMenuScrollContainer = document.querySelector(
            `${this.containerSelector} .js_tabNav_scrollArea`
        );

        if (this.tabButtons.length > 0) {
            this.startTab = this.getStartTabElement(startTabId);
            this.setupNewTab(this.startTab);
            this.addTabListener();
            this.addArrowNavigationListener();
        }
    }

    /**
     * * Get the tab that will start active when the page loads. (If there is an active URL Hash, the Hash Tab will prevail)
     * @returns {HTMLButtonElement} startTab
     */
    getStartTabElement(startTabId) {
        const activeTabURLHash = this.getActiveTabByURLHash();
        let [startTab] = this.tabButtons;

        if (activeTabURLHash) {
            startTab = activeTabURLHash;
        } else if (startTabId) {
            startTab = document.getElementById(startTabId);
        }

        return startTab;
    }

    /**
     * * Returns a tab, if it is active by the Hash in the URL
     * @returns {HTMLButtonElement, false}
     */
    getActiveTabByURLHash() {
        if (window.location.hash) {
            return document.querySelector(`${this.containerSelector} ${window.location.hash}`);
        }

        return false;
    }

    /**
     * * Add listen events to tab navigation buttons
     */
    addTabListener() {
        this.tabButtons.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                if (!tab.classList.contains(this.statusClasses.active)) {
                    this.setupNewTab(tab);
                }
            });
        });
    }

    /**
     * * Deactivates the previously active tab.
     * @param {HTMLButtonElement} tab
     */
    disableTab(tab) {
        if (tab) {
            const tabPanel = this.getTabPanel(tab);

            tab.classList.remove(this.statusClasses.active);
            tab.setAttribute('aria-selected', false);
            tabPanel.classList.remove(this.statusClasses.active);
        }
    }

    /**
     * * Enables the new active tab.
     * @param {HTMLButtonElement} tab
     */
    enableTab(tab) {
        const tabPanel = this.getTabPanel(tab);

        tabPanel.classList.add(this.statusClasses.active);
        tab.classList.add(this.statusClasses.active);
        tab.setAttribute('aria-selected', true);
        tab.focus();
    }

    /**
     * * Get current active TAB
     * @return {HTMLButtonElement}
     */
    getCurrentTab() {
        return document.querySelector(`${this.containerSelector} [aria-selected="true"]`);
    }

    /**
     * * This method is responsible for firing all the triggers needed to activate a new tab
     * @param {HTMLButtonElement} newTab
     */
    setupNewTab(newTab) {
        const currentTab = this.getCurrentTab();
        const tabs = {
            currentTab,
            newTab,
        };

        this.eventTabChangeStart.data = tabs;
        this.dispatchEvent(this.eventTabChangeStart);

        this.disableTab(currentTab);
        this.enableTab(newTab);

        this.tabNavHorizontalScroll(newTab);
        this.setUrlHash(newTab.id);

        if (this.needLoading(newTab)) {
            this.showLoading(newTab);
        }

        this.eventTabChangeEnd.data = tabs;
        this.dispatchEvent(this.eventTabChangeEnd);
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

    // * Loading methods

    /**
     * * Returns Loading element if it's exists
     * @param {string} id Unique ID used to identify the load element
     * @returns {HTMLBaseElement or false}
     */
    getLoadingElement(id) {
        const loadingElement = document.querySelector(
            `${this.containerSelector} > .js_tabNav_loading`
        );

        if (loadingElement) {
            const newLoadingElement = loadingElement.cloneNode(true);
            newLoadingElement.dataset.id = id;
            return newLoadingElement;
        }

        return false;
    }

    /**
     * * Checks if the tab needs to be loaded
     * @param {HTMLButtonElement} tab
     * @return {Boolean}
     */
    needLoading(tab) {
        return !!(
            tab.dataset.load &&
            !tab.classList.contains(this.statusClasses.loading.finished) &&
            !tab.classList.contains(this.statusClasses.loading.active)
        );
    }

    /**
     * * Remove loading class
     * * Adds loaded class
     * * Remove the element that indicates that the content of the tab is loading
     * @param {HTMLButtonElement} tab
     */
    hideLoading(tab) {
        if (tab) {
            const tabLoading = document.querySelector(`.js_tabNav_loading[data-id="${tab.id}"]`);

            tab.classList.remove(this.statusClasses.loading.active);
            tab.classList.add(this.statusClasses.loading.finished);

            if (tabLoading) {
                tabLoading.remove();
            }

            this.eventTabLoadEnd.data = tab;
            this.dispatchEvent(this.eventTabLoadEnd);
        }
    }

    /**
     * * Adds loading class
     * * Adds the element that indicates that the content of the tab is loading
     * @param {HTMLButtonElement} tab
     */
    showLoading(tab) {
        const loadingElement = this.getLoadingElement(tab.id);

        if (tab) {
            this.eventTabLoadStart.data = tab;
            this.dispatchEvent(this.eventTabLoadStart);

            tab.classList.add(this.statusClasses.loading.active);
        }

        if (loadingElement && tab) {
            const tabPanel = this.getTabPanel(tab);
            tabPanel.appendChild(loadingElement);
            loadingElement.classList.add(this.statusClasses.active);
        }
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
        this.eventTabLoadStart = new Event('tabLoad:start');
        this.eventTabLoadEnd = new Event('tabLoad:end');
    }
}
