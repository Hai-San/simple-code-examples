/**
 * * Start new Focus area instance
 */

const myCustomTabNavigationArea = new TabNavigationArea();

/**
 * * Configure parameters for new focus area
 */
myCustomTabNavigationArea.init({
    containerId: 'container',
    buttonEnterId: 'button_enter',
    buttonExitId: 'button_exit',
    focusOnEnterId: 'input_text',
    focusOnExitId: 'button_enter',
});

/**
 * * Configure listeners for focus area events
 */
myCustomTabNavigationArea.addEventListener('area:enter:before', (event) => {
    console.log('Triggers before entering the area');
});

myCustomTabNavigationArea.addEventListener('area:exit:before', (event) => {
    console.log('Triggers before exit the area');
});
