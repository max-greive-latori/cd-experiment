export default {
    products: {
        addToCart: {
            start: new Event('products:addToCart:start'),
            end: new Event('products:addToCart:end')
        },
        removeFromCart: {
            start: new Event('products:removeFromCart:start'),
            end: new Event('products:removeFromCart:end')
        }
    },
    cart: {
        get: {
            start: new Event('cart:get:start'),
            end: new Event('cart:get:end')
        },
        updated: new Event('cart:updated'),
        cleared: new Event('cart:cleared')
    },
    quickshop: {
        addToCart: {
            start: new Event('quickshop:addToCart:start'),
            end: new Event('quickshop:addToCart:end')
        }
    }
};

