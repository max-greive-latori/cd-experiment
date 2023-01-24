import themeEvents from '@js/general/theme-events.js';
const defaultHeaders = new Headers();
defaultHeaders.append('Content-Type', 'application/json');

/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-touchevents-setclasses !*/
 !function(e,n,t){function o(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?u.className.baseVal=n:u.className=n)}function s(e,n){return typeof e===n}function a(){var e,n,t,o,a,i,r;for(var l in c)if(c.hasOwnProperty(l)){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=s(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=o:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=o),f.push((o?"":"no-")+r.join("-"))}}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",p=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c=[],d={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=n.documentElement,p="svg"===u.nodeName.toLowerCase(),h=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];d._prefixes=h;var m=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(o,function(e){t=9===e.offsetTop})}return t}),a(),o(f),delete d.addTest,delete d.addAsyncTest;for(var v=0;v<Modernizr._q.length;v++)Modernizr._q[v]();e.Modernizr=Modernizr}(window,document);

/**
 * 
 * @param {Object} cart 
 */
theme.onCartUpdate = (cart) => {
    themeEvents.cart.updated.cart = cart;
    document.dispatchEvent(themeEvents.cart.updated);
};

/**
 * 
 * @param {Array} items 
 */
theme.onItemsAdded = (items) => {
    themeEvents.products.addToCart.end.items = items;
    document.dispatchEvent(themeEvents.products.addToCart.end);
};

/**
 * 
 * @param {Function} cb - The callback that handles the response.
 */
theme.getCart = async (cb) => {
    document.dispatchEvent(themeEvents.cart.get.start);
    const cart = await fetch('/cart.json', { headers: defaultHeaders }).then(async r => await r.json());
    document.dispatchEvent(themeEvents.cart.get.end);
    if ("function" == typeof cb) {
        cb(cart);
    }
    return theme.onCartUpdate(cart);
};

/**
 * 
 * @param {Function} cb - The callback that handles the response.
 */
theme.clearCart = async (cb) => {
    const cart = await fetch('/cart/clear', { method: 'GET', headers: defaultHeaders });
    document.dispatchEvent(themeEvents.cart.cleared);
    if ("function" == typeof cb) {
        cb(cart);
    }
};

/**
 * 
 * @param {Array} items 
 * @param {Function} cb - The callback that handles the response.
 */
theme.addToCart = async (items, cb, el) => {
    themeEvents.products.addToCart.start.items = items;
    document.dispatchEvent(themeEvents.products.addToCart.start);
    if (el) {
        el.classList.add('loading');
        el.setAttribute("disabled", true);
    }
    const result = await fetch('/cart/add.js', { method: 'POST', headers: defaultHeaders, body: JSON.stringify({ items: items }) }).then(async r => await r.json());
    if ("function" == typeof cb) {
        cb(result.items);
    }
    if (el) {
        el.classList.remove('loading');
        el.classList.add('success');
        setTimeout(() => {
            el.removeAttribute("disabled");
            el.classList.remove('success');
        }, 1000);
    }
    theme.onItemsAdded(result.items);
    theme.getCart();
};

/**
 * 
 * @param {Array} items - Should contain only Shopify variant keys or variant ids
 * @param {Function} cb - The callback that handles the response.
 */
theme.removeFromCart = async (items, cb) => {
    if (!Array.isArray(items)) {
        throw 'error';
    }
    themeEvents.products.removeFromCart.start.items = items;
    document.dispatchEvent(themeEvents.products.removeFromCart.start);
    const response = await fetch('/cart/update.js', { method: 'POST', headers: defaultHeaders, body: JSON.stringify({ updates: Object.assign({},...items.map(key => ({[key]: 0}))) }) }).then(r => r.json());
    document.dispatchEvent(themeEvents.products.removeFromCart.end);
    if ("function" == typeof cb) {
        cb(response);
    }
    theme.getCart();
};

/**
 * 
 * @param {Object} updates 
 * @param {Function} cb - The callback that handles the response.
 */
theme.updateCart = async (updates, cb) => {
    const response = await fetch('/cart/update.js', { method: 'POST', headers: defaultHeaders, body: JSON.stringify({ updates: updates }) }).then(r => r.json());
    if ("function" == typeof cb) {
        cb(response);
    }
    theme.getCart();
};

/**
 * 
 * @param {String} key – Target key can be a variant's id or key.
 * @param {Number} qty – Quantity of the changing product.
 * @param {Function} cb - The callback that handles the response.
 */
theme.changeQuantity = async (key, qty, cb) => {
    const response = await fetch('/cart/update.js', { method: 'POST', headers: defaultHeaders, body: JSON.stringify({ updates: { [key]: qty } }) }).then(r => r.json());
    if ("function" == typeof cb) {
        cb(response);
    }
    theme.getCart();
};

/**
 * 
 * @param {HTMLElement} el – Targeting DOM-Element
 */
theme.quickshop = (el) => {
    if (el && el.dataset.variantId) {
        theme.addToCart([{ id: el.dataset.variantId, quantity: 1 }]);
    }
};

/**
 * 
 * @param {Number} t – Money amount in cents, e.g. 5000 (equals 50 EUR)
 * @param {String} e – Money format, e.g. '{{ amount }} €'
 */
theme.formatMoney = function(t, e) {
    const money_format = "${{amount}}";
    function n(t, e) {
        return void 0 === t ? e : t
    }
    function o(t, e, o, i) {
        if (e = n(e, 2),
        o = n(o, ","),
        i = n(i, "."),
        isNaN(t) || null == t)
            return 0;
        var r = (t = (t / 100).toFixed(e)).split(".");
        return r[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + o) + (r[1] ? i + r[1] : "")
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var i = ""
      , r = /\{\{\s*(\w+)\s*\}\}/
      , a = e || document.body.dataset.moneyFormat || money_format;
    switch (a.match(r)[1]) {
    case "amount":
        i = o(t, 2);
        break;
    case "amount_no_decimals":
        i = o(t, 0);
        break;
    case "amount_with_comma_separator":
        i = o(t, 2, ".", ",");
        break;
    case "amount_with_space_separator":
        i = o(t, 2, " ", ",");
        break;
    case "amount_with_period_and_space_separator":
        i = o(t, 2, " ", ".");
        break;
    case "amount_no_decimals_with_comma_separator":
        i = o(t, 0, ".", ",");
        break;
    case "amount_no_decimals_with_space_separator":
        i = o(t, 0, " ");
        break;
    case "amount_with_apostrophe_separator":
        i = o(t, 2, "'", ".")
    }
    return a.replace(r, i)
};