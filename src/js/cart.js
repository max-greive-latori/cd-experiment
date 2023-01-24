import '@sass/templates/cart.scss';
import App from '@js/cart/App.svelte';

const cart = () => {

    const elCart = document.querySelector('[data-cart]');
    const jsonNode = elCart.querySelector('script[type="application/json"]');
    const jsonText = jsonNode.textContent;
    const jsonData = JSON.parse(jsonText);

    return new App({
        target: elCart,
        props: jsonData
    });

}

document.addEventListener("DOMContentLoaded", cart);

export default cart;