const customTabNav = new TabNavigation();

customTabNav.addEventListener('tabChange:start', (event) => {
    if (event.data.newTab.id === 'tabExample_02') {
        setTimeout(() => {
            customTabNav.hideLoading(event.data.newTab);
        }, 10000);
    }
});

customTabNav.init();
