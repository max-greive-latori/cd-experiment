import 'url-search-params-polyfill';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import '@sass/templates/main.scss';
import '@js/general/theme-helpers';
import '@js/general/prototypes';
import { setDimensions } from '@js/general/helpers';

document.addEventListener("DOMContentLoaded", () => {

    setDimensions({ header: { include: false }});

});