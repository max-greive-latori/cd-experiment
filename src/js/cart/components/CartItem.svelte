<script>

    import { onMount } from 'svelte';

    export let item;
    export let i18n;

    const formatMoney = (price) => theme.formatMoney(price, '€ {{ amount }}');
    const removeItem = () => theme.removeFromCart([item.key]);
    const increaseQuantity = () => theme.changeQuantity(item.key, ++item.quantity);
    const decreaseQuantity = () => theme.changeQuantity(item.key, --item.quantity);

    $: title = item.title;
    $: price = formatMoney(item.price);
    $: original_line_price = formatMoney(item.original_line_price);
    $: final_line_price = formatMoney(item.final_line_price);

    onMount(async () => {
	});

</script>

<tr>
    <td>
        {title}
        <button on:click|preventDefault={removeItem}>{i18n['cart.general.remove']}</button>
    </td>
    <td>
        {price}
    </td>
    <td>
        <button on:click|preventDefault={decreaseQuantity}>-</button>
        <input type="number" name="updates[]" bind:value={item.quantity} min="0" pattern="[0-9]*">
        <button on:click|preventDefault={increaseQuantity}>+</button>
    </td>
    <td>
        {#if item.original_line_price == item.final_line_price}
            {original_line_price}
        {:else}
            <s>{original_line_price}</s>
            {final_line_price}
        {/if}
    </td>
</tr>




