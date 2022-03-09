const customTabNav = new TabNavigation();

customTabNav.addEventListener('tabChange:end', (event) => {
    if (event.data.id === 'tabExample_02') {
        setTimeout(() => {
            customTabNav.hideLoading();
        }, 2000);
    }
});

customTabNav.init();
