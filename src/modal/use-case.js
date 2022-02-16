/**
 * * Start new modal instance
 */
const simpleModal = new SimpleModal();

/**
 * * Configure parameters for new modal
 */
simpleModal.init({
    modalId: 'myCustomModal',
    openSelector: '.js_myCustomModal_open',
    closeSelector: '.js_myCustomModal_close',
});

/**
 * * Configure listeners for modal events
 */
simpleModal.addEventListener('modal:open:before', (event) => {
    console.log('Trigger before the modal is opened');
});

simpleModal.addEventListener('modal:open:after', (event) => {
    console.log('Trigger after the modal os opened');
});

simpleModal.addEventListener('modal:close:before', (event) => {
    console.log('Trigger before the modal is closed');
});

simpleModal.addEventListener('modal:close:after', (event) => {
    console.log('Trigger after the modal is closed');
});
