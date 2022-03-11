/**
 * * Start new tab navigation area instance
 */

const customTabNav = new TabNavigation();

/**
 * * Configure listeners for TAB navigation events
 * * You have to call addEventListener, BEFORE the call to dispatchEvent
 */
customTabNav.addEventListener('tabChange:start', (event) => {
    console.log('Fires before the new tab is activated');
});

customTabNav.addEventListener('tabChange:end', (event) => {
    console.log('Fires after new tab is activated');
});

customTabNav.addEventListener('tabLoad:start', (event) => {
    console.log('Fires when tab loading starts');

    if (event.data.id === 'tabExample_02') {
        const tab = event.data;

        console.dir(tab);
        setTimeout(() => {
            console.dir(tab);
            customTabNav.hideLoading(tab);
        }, 10000);
    }

    if (event.data.id === 'tabExample_04') {
        const tab = event.data;

        console.dir(tab);
        setTimeout(() => {
            customTabNav.hideLoading(tab);
        }, 5000);
    }
});

customTabNav.addEventListener('tabLoad:end', (event) => {
    console.log('Fires when tab loading ends');
});

/**
 * * Send parameters for new TAB navigation and Start it
 */
customTabNav.init({
    containerSelector: '#myCustomTabNav',
    startTabId: 'tabExample_05',
});
