const customTabNav = new TabNavigation();

customTabNav.addEventListener('tabChange:start', (event) => {
    if (event.data.newTab.id === 'tabExample_02' && customTabNav.needLoading(event.data.newTab)) {
        const tab = event.data.newTab;

        console.dir(tab);
        setTimeout(() => {
            console.dir(tab);
            customTabNav.hideLoading(tab);
        }, 10000);
    }

    if (event.data.newTab.id === 'tabExample_04' && customTabNav.needLoading(event.data.newTab)) {
        const tab = event.data.newTab;

        console.dir(tab);
        setTimeout(() => {
            customTabNav.hideLoading(tab);
        }, 5000);
    }
});

customTabNav.init();
