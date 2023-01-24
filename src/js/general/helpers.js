export const setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const setDimensions = function (options) {
    // define default settings for setDimensions helper function
    let settings = Object.assign({
        header: {
            include: true,
            selector: 'header.header'
        }
    }, options);
    // get the page header if it's present
    let header = document.querySelector(settings.header.selector) || null;
    // set a css custom property to the header's height
    if (settings.header.include && header) {
        document.documentElement.style.setProperty("--hh", `${header.clientHeight}px`);
    }
    // loop through the properties of the document's viewport and create css custom properties for each
    for (let dim in document.viewport) {
        document.documentElement.style.setProperty(`--v${dim.first}`, `${document.viewport[dim] * 0.01}px`);
    }
    // return the document's viewport, it might be used later
    return document.viewport;
}

export const serialize = form => {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;
        if (field.type === 'select-multiple') {
            Array.prototype.slice.call(field.options).forEach(function (option) {
                if (!option.selected) return;
                arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(option.value));
            });
            return;
        }
        if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
        arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
    });
    return arr.join('&');
};

export const serializeJson = form => {
    var arr = {};
    Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;
        if (field.type === 'select-multiple') {
            Array.prototype.slice.call(field.options).forEach(function (option) {
                if (!option.selected) return;
                arr[field.name] = option.value;
            });
            return;
        }
        if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
        arr[field.name] = field.value;
    });
    return arr;
}

export const KEYCODE = {
    /* command keys */
    ENTER: 13,
    ESC: 27,
    /* navigation keys */
    BACKSPACE: 8,
    TAB: 9,
    SPACE: 32,
    PAGE: {
        UP: 33,
        DOWN: 34,
        END: 35,
        HOME: 36,
    },
    ARROW: {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
    },
    /* other keys */
    CAPSLOCK: 20,
};

export const about = x => {
    let t = Object.prototype.toString.call(x).replace(/[\[\]]/g, '').split(' ');
    let r = {
        __proto: null,
        __type: t[1],
        object: t[0],
        type: t[1].toLowerCase()
    };
    if (/(?:null|undefined)/ig.test(t[1])) {
        return r
    };
    if (x instanceof Object) {
        r.__proto = "Object";
        if (x.constructor) {
            r.__type = x.constructor.name;
        }
    } else {
        r.__proto = Object.getPrototypeOf(x);
    }
    return r;
};