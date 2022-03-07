/**
 * * Este módulo é responsável por criar uma navegação entre TABS dentro de uma página.
 */
class TabNav {
    constructor() {
        this.createCustomEvents();

        this.statusClasses = {
            active: 'is_active',
            loading: {
                active: 'is_loading',
                finished: 'is_loaded',
            },
        };
    }

    /**
     * * Utilizado iniciar um componente de navegação por TAB
     * @param {object}
     * @param {string} containerSelector ID do container principal
     * @param {boolean} scrollY Utilizado para indicar se a página deve rolar até o conteúdo
     */
    init(
        { containerSelector = '#tabNav', scrollY = false, startTabId = '' } = {
            containerSelector: undefined,
            scrollY: undefined,
            startTabId: undefined,
        }
    ) {
        this.scrollY = scrollY;
        this.startTabId = startTabId;
        this.containerSelector = containerSelector;

        this.tabs = document.querySelectorAll(`${this.containerSelector} [role="tab"]`);
        this.tabLoading = document.querySelector(`${this.containerSelector} .js_tabNav_loading`);
        this.tabScroll = document.querySelector(`${this.containerSelector} .js_tabNav_scrollArea`);

        if (this.tabs.length > 0) {
            this.setStartTab();
            this.chooseActiveTab();
            this.addTabNavListener();
            this.addArrowsListener();
        }
    }

    setStartTab() {
        if (this.startTabId) {
            this.startTab = document.getElementById(this.startTabId);
        } else {
            [this.startTab] = this.tabs;
        }
    }

    addTabNavListener() {
        this.tabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                if (!tab.classList.contains(this.statusClasses.active)) {
                    this.setActiveTab(tab);
                }
            });
        });
    }

    disableCurrentTab() {
        const currentTab = document.querySelector(
            `${this.containerSelector} [aria-selected="true"]`
        );

        if (currentTab) {
            this.eventTabChangeStart.data = currentTab;
            this.dispatchEvent(this.eventTabChangeStart);

            const currentTabPanel = this.getTabPanel(currentTab);

            currentTab.classList.remove(this.statusClasses.active);
            currentTab.setAttribute('aria-selected', false);
            currentTabPanel.classList.remove(this.statusClasses.active);
        }
    }

    setActiveTab(tab) {
        this.disableCurrentTab();

        const tabPanel = this.getTabPanel(tab);

        this.hideLoading();
        this.tabNavHorizontalScroll(tab);

        tabPanel.classList.add(this.statusClasses.active);
        tab.classList.add(this.statusClasses.active);
        tab.setAttribute('aria-selected', true);

        this.setUrlHash(tab.id);
        this.checkLoadingCondition(tab);

        this.eventTabChangeEnd.data = tab;
        this.dispatchEvent(this.eventTabChangeEnd);
    }

    setUrlHash(tabId) {
        const activeTabId = `#${tabId}`;

        if (this.scrollY) {
            window.location.hash = activeTabId;
        } else {
            window.history.replaceState(
                '',
                document.title,
                `${window.location.origin}${window.location.pathname}${activeTabId}`
            );
        }
    }

    checkLoadingCondition(tab) {
        if (
            tab.dataset.load &&
            this.tabLoading &&
            !tab.classList.contains(this.statusClasses.loading.finished) &&
            !tab.classList.contains(this.statusClasses.loading.active)
        ) {
            tab.classList.add(this.statusClasses.loading.active);
            this.showLoading();
        }
    }

    hideLoading() {
        this.tabLoading.classList.remove(this.statusClasses.active);
    }

    showLoading() {
        this.tabLoading.classList.add(this.statusClasses.active);
    }

    getTabPanel(tab) {
        return document.getElementById(tab.getAttribute('aria-controls'));
    }

    chooseActiveTab() {
        if (this.getActiveTabUrlHash()) {
            this.setTabByHash();
        } else {
            this.setActiveTab(this.startTab);
        }
    }

    setTabByHash() {
        const activeTab = document.querySelector(
            `${this.containerSelector} ${this.getActiveTabUrlHash()}`
        );

        if (activeTab) {
            this.setActiveTab(activeTab);
        }
    }

    getActiveTabUrlHash() {
        return window.location.hash;
    }

    addArrowsListener() {
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

    tabNavHorizontalScroll(tab) {
        const tabRect = tab.getBoundingClientRect();
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const scrollSize =
            tabRect.width - (screenWidth - tabRect.x) + (screenWidth - tabRect.width) / 2;

        const scrollX = this.tabScroll.scrollLeft + scrollSize;

        this.tabScroll.scrollTo({
            top: 0,
            left: scrollX,
            behavior: 'smooth',
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

        this.eventTabChangeStart = new Event('tabChange:start');
        this.eventTabChangeEnd = new Event('tabChange:end');
    }
}
