<script>

    import { onMount } from 'svelte';
    import CartItem from '@js/cart/components/CartItem.svelte';
    import themeEvents from '@js/general/theme-events.js';

    export let cart;
    export let i18n;

    const formatMoney = (price) => theme.formatMoney(price, '€ {{ amount }}');

    $: total_price = cart ? formatMoney(cart.total_price) : 0;

    onMount(async () => {
		theme.getCart();
		document.addEventListener('cart:updated', (e) => cart = e.cart, false);
	});

</script>

{i18n['cart.general.title']}

{#if !cart}
    Loading
{:else}
    {#if cart && cart.items && cart.items.length == 0}
        {i18n['cart.general.empty']}
    {:else}
        <form action="/cart" method="post" novalidate>
            <table>
                <thead>
                    <tr>
                        <th>{i18n['cart.label.product']}</th>
                        <th>{i18n['cart.label.price']}</th>
                        <th>{i18n['cart.label.quantity']}</th>
                        <th>{i18n['cart.label.total']}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each cart.items as item, i (item.key)}
                        <CartItem item={item} index={i} i18n={i18n} cart={cart} />
                    {/each}
                </tbody>
            </table>
            <div>
                <p>{i18n['cart.general.subtotal']}: {total_price}</p>
                <p><small>{@html i18n['taxes_shipping_checkout']}</small></p>
            </div>
            <input type="hidden" name="checkout" value="Checkout">
            <button type="submit">{i18n['cart.general.checkout']}</button>
        </form>
    {/if}
{/if}