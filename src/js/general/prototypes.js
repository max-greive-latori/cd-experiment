import { about } from '@js/general/helpers';
import Accordion from '@js/general/accordion.js';
// ============================================================
// Prototype Extensions

// ============================================================
!function (d, w) {
  // ============================================================
  // Function extensions
  // ============================================================
  if (!Function.prototype.debounce) {
    /**
     * This method delays the execution of a function until the last occurance of e.g. an event fired within a specified period. This is useful if the function is bound to an frequently firing event, like `scroll` or `resize`.
     * @param delay the period (in milliseconds) the function get delayed for.
     */
    Function.prototype.debounce = function debounce(delay) {
      const f = this;
      delay = delay || 250;
      let t;
      return function () {
        clearTimeout(t);
        t = setTimeout(() => {
          t = null;
          f.apply(this, arguments);
        }, delay);
      };
    };
  }
  if (!Function.prototype.throttle) {
    /**
     * This method prevents a function from being executed multiple times within a given period. This is useful if the function is bound to a `click`-event for example to prevent the function to be executed again and again e.g. if an impatient user clicks multiple times
     * @param delay the period within further function executions are prevented.
     */
    Function.prototype.throttle = function throttle(delay) {
      const f = this;
      delay = delay || 250;
      let t;
      return function () {
        clearTimeout(t);
        if (!t) { f.apply(this, arguments); }
        t = setTimeout(() => (t = null), delay);
      };
    };
  }
  // ============================================================
  // Array extensions
  // ============================================================
  if (!Array.prototype.hasOwnProperty("last")) {
    /**
     * This property refers to the last element in an array. This is the same as using `array[array.length - 1];`
     */
    Object.defineProperty(Array.prototype, "last", {
      get: function () { return this[this.length - 1]; }
    });
  }
  if (!Array.prototype.hasOwnProperty("first")) {
    /**
     * This property refers to the very first element in an array. This is the same as using `array[0];`
     */
    Object.defineProperty(Array.prototype, "first", {
      get: function () { return this[0]; }
    });
  }
  if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
      const arr = [...this];
      for (let i = arr.length - 1; i > 0; --i) {
        const rndIdx = Math.floor(Math.random() * (i - 1));
        [arr[i], arr[rndIdx]] = [arr[rndIdx], arr[i]];
      }
      return arr;
    };
  }
  // ============================================================
  // String extensions
  // ============================================================
  if (!String.prototype.toBoolean) {
    /**
     * This method checks if the string in question matches to a `RegEx` of "falsy values", and either returns `true` if the check failes or `false` otherwise.
     */
    String.prototype.toBoolean = function _stringToBoolean() {
      return !/^(?:false|-?0n?|\s*|n(?:ull|an|one)|undefined)$/i.test(this);
    };
  }
  if (!String.prototype.hasOwnProperty("first")) {
    /**
     * This property returns the first character in a string. This is the same as using `str.substr(0,1);`
     * Inspired by the Liquid filter of the same name ` | first`
     */
    Object.defineProperty(String.prototype, "first", {
      get: function () { return this.substr(0, 1); }
    });
  }
  if (!String.prototype.hasOwnProperty("last")) {
    /**
     * This property returns the last character in a string. This is the same as using `str.substr(-1,1);`
     */
    Object.defineProperty(String.prototype, "last", {
      get: function () { return this.substr(-1, 1); }
    });
  }
  if (!String.prototype.handleize) {
    /**
     * This method converts the string it's executed on into a kebab-cased handle. Inspired by the Liquid filter of the same name `| handleize`
     */
    String.prototype.handleize = function handleize() {
      return this.trim()
        .toLowerCase() // remove leading and trailing spaces
        .replace(/\s+/g, "-") // replace whitespaces inside text by dashes
        .replace(/[^\w\s-]/g, ""); // remove characters which do not belong to any of these groups: alphanumerics, underscore, whitespaces, dashes
    };
  }
  if (!String.prototype.imgURL) {
    String.prototype.imgURL = function (size) {
      return this.trim()
        .replace(/_(?:pico|icon|thumb|small|compact|medium|large|grande|original|(?:\d{1,4})x\d{1,4}|master)+\./g, '.')
        .replace(/\.(?:jpe?g|png|gif)/g, function (match) {
          return '_' + size + match;
        });
    };
  }
  // ============================================================
  // Number extensions
  // ============================================================
  if (!Number.prototype.hasOwnProperty("positive")) {
    /**
     * This method returns true of the number variable it's executed on is greater than 0
     */
    Object.defineProperty(Number.prototype, "positive", {
      get: function () {
        return this > 0;
      }
    });
  }
  if (!Number.prototype.hasOwnProperty("isZero")) {
    /**
     * This method returns true of the number variable it's executed on is equal to 0
     */
    Object.defineProperty(Number.prototype, "isZero", {
      get: function () {
        return this === 0;
      }
    });
  }
  if (!Number.prototype.hasOwnProperty("negative")) {
    /**
     * This method returns true of the number variable it's executed on is lower than 0
     */
    Object.defineProperty(Number.prototype, "negative", {
      get: function () {
        return this < 0;
      }
    });
  }
  if (!Number.prototype.pad) {
    /**
     * This function converts a number into a string by padding it to a specified length using a specified character
     * @param {(object|number|string|array)} [options={size:2, char: '0'}] can be one of these:
     * - {object} a set of padding options (defaults to `{size:2, char: '0'}`) OR
     * - {number} the size the number has to be padded to OR
     * - {string} the padding-character to use OR
     * - {any[]} an array of variable length in the form of `[size, char]`
     */
    Number.prototype.pad = function _padNumber(options) {
      const Settings = {
        size: 2,
        char: "0"
      };
      switch (typeof options) {
        case "object":
          if (options instanceof Array) {
            Settings.size =
              options[0] >= Settings.size ? options[0] : Settings.size;
            Settings.char = options[options.length - 1] || Settings.char;
          } else {
            Object.assign(Settings, options);
          }
          break;
        case "number":
          Settings.size = options >= Settings.size ? options : Settings.size;
          break;
        case "string":
          // if the given string is empty the default will be used as padding without a character is nonsense
          Settings.char = options.substr(0, 1) || Settings.char;
          break;
      }
      let s = String(this);
      while (s.length < (Settings.size || 2)) {
        s = (Settings.char || "0") + s;
      }
      return s;
    };
  }
  // ============================================================
  // Document extensions
  // ============================================================
  if (!HTMLDocument.prototype.hasOwnProperty("viewport")) {
    /**
     * This property returns an object of the current viewports width and height
     */
    Object.defineProperty(HTMLDocument.prototype, "viewport", {
      get: function () {
        return {
          height: w.innerHeight || this.documentElement.clientHeight,
          width: w.innerWidth || this.documentElement.clientWidth,
          ratio: w.innerWith / w.innerHeight || this.documentElement.clientWidth / this.documentElement.clientHeight
        };
      }
    });
  }
  if (!HTMLDocument.prototype.on) {
    HTMLDocument.prototype.on = function () {
      HTMLDocument.prototype.addEventListener.apply(this, arguments);
    }
  }
  if (!HTMLDocument.prototype.off) {
    HTMLDocument.prototype.off = function () {
      HTMLDocument.prototype.removeEventListener.apply(this, arguments);
    }
  }
  if (!HTMLDocument.prototype.trigger) {
    HTMLDocument.prototype.trigger = function (eventName) {
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent(eventName, true, true);
      this.dispatchEvent(evt);
    };
  }
  // ============================================================
  // Window extensions
  // ============================================================
  if (!Window.prototype.on) {
    Window.prototype.on = function () {
      Window.prototype.addEventListener.apply(this, arguments);
    }
  }
  if (!Window.prototype.off) {
    Window.prototype.off = function () {
      Window.prototype.removeEventListener.apply(this, arguments);
    }
  }
  // ============================================================
  // HTMLFormElement extensions
  // ============================================================
  if (!HTMLFormElement.prototype.validate) {
    /**
     * This method implements a client side form validation.
     *
     * **\/!\ ATTENTION** *This is intended to be an **additional** validation to prevent forms from being submitted with invalid fields. Nevertheless client side validation is **no assurance** that no invalid data get sent to the server. A proper server side validation has to be implemented on you own.*
     */
    HTMLFormElement.prototype.validate = function _validateHTMLFormElement() {
      this.invalidFields = [];

      Array.from(this.elements).forEach((field) => {
        if (
          !field.name ||
          field.disabled ||
          ["file", "reset", "submit", "button"].indexOf(field.type) > -1
        ) {
          return;
        }
        if (field.readOnly) {
          field.readOnly = false;
          if (!field.validity.valid) {
            this.invalidFields.push(field);
          }
          field.readOnly = true;
        } else {
          if (!field.validity.valid) {
            this.invalidFields.push(field);
          }
        }
      });

      this.valid = this.invalidFields.length === 0;
      return this.valid;
    };
  }
  if (!HTMLFormElement.prototype.serialize) {
    /**
     * This method is used to serialize an HTML form into an object representing each field's name and value.
     * Inspired by the serialize() helper function of Chris Ferdinandi - https://gomakethings.com
     */
    HTMLFormElement.prototype.serialize = function _serializeHTMLFormElement() {
      let FormData = {};
      Array.from(this.elements).forEach((field) => {
        if (!field.name || field.disabled || ["file", "reset", "submit", "button"].indexOf(field.type) > -1) { return; }
        if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked) { return; }
        const _matches = field.name.match(/(\w+)\[(\w+)\]/i);
        if (field.type === "select-multiple") {
          let options = [];
          Array.from(field.options).forEach((option) => {
            if (!option.selected) { return; }
            options.push(option.value);
          });
          if (_matches.length > 1) {
            FormData[_matches[1]] = FormData[_matches[1]] || {};
            FormData[_matches[1]][_matches[2].toLowerCase()] = options;
          } else {
            FormData[field.name] = options;
          }
        } else {
          if (_matches.length > 1) {
            FormData[_matches[1]] = FormData[_matches[1]] || {};
            FormData[_matches[1]][_matches[2].toLowerCase()] = field.value;
          } else {
            FormData[field.name] = field.value;
          }
        }
      });
      return FormData;
    };
  }
  if (!HTMLFormElement.prototype.trigger) {
    HTMLFormElement.prototype.trigger = function (eventName) {
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent(eventName, true, true);
      this.dispatchEvent(evt);
    };
  }
  // ============================================================
  // Node & NodeList extensions
  // ============================================================
  if (!Node.prototype.hasOwnProperty("Siblings")) {
    /**
     * This property returns an array of all non-textual siblings of the current HTMLNode.
     * Inspired by the jQuery method of the same name.
     */
    Object.defineProperty(Node.prototype, "Siblings", {
      get: function () {
        return [...this.parentNode.childNodes].filter((e) => e !== this && e.nodeType === 1);
      }
    });
  }
  if (!Node.prototype.siblings) {
    Node.prototype.siblings = function (selector) {
      if (selector) {
        let _sibs = this.parentNode.querySelectorAll(selector);
        if (_sibs.length === 1) { return _sibs[0]; }
        return _sibs;
      }
      return [...this.parentNode.childNodes].filter((e) => e !== this && e.nodeType === 1);
    }
  }
  if (!Node.prototype.wrap) {
    /**
     * This method wraps the current Node in a specified tag using given options. The initial usecase of this method was to wrap plain textnodes - coming from an external source - into `<p></p>`.
     * @param {string} tag - the name of the tag used to wrap the node
     * @param {object} options - a set ob options to be used to define what kind of node shall be wrapped (defaults to `{type: 3, ignoreEmptyNode: true}`)
     * @param {number} options.type - the numeric node type value
     * 1.  ELEMENT_NODE
     * 2.  ATTRIBUTE_NODE
     * 3.  TEXT_NODE
     * 4.  CDATA_SECTION_NODE
     * 5.  ENTITY_REFERENCE_NODE
     * 6.  ENTITY_NODE
     * 7.  PROCESSING_INSTRUCTION_NODE
     * 8.  COMMENT_NODE
     * 9.  DOCUMENT_NODE
     * 10. DOCUMENT_TYPE_NODE
     * 11. DOCUMENT_FRAGMENT_NODE
     * 12. NOTATION_NODE`)
     * @param {boolean} options.ignoreEmptyNode - whether empty nodes should be ignored
     */
    Node.prototype.wrap = function _wrapNode(tag, options) {
      tag = tag || "p";
      options = Object.assign({
        type: 3, //textNodes
        ignoreEmptyNode: true
      }, options);
      if (options.ignoreEmptyNode && this.textContent.trim() === "") { return; }
      if (this.nodeType !== options.type) { return; }
      this.textContent = this.textContent.trim();
      let wrap = document.createElement(tag);
      this.parentNode.insertBefore(wrap, this);
      wrap.appendChild(this);
      return this;
    };
  }
  if (!NodeList.prototype.wrap) {
    /**
     * This function wraps each node of the current NodeList into a specified tag by forwarding its parameters to the underlying _wrapNode() function.
     */
    NodeList.prototype.wrap = function _wrapNodes(tagName, options) {
      this.forEach((node) => node.wrap(tagName, options));
      return this;
    };
  }
  if (!NodeList.prototype.first) {
    /**
     * This property returns the first Node of the current NodeList.
     */
    NodeList.prototype.first = function _firstNode() {
      return Array.from(this)[0];
    };
  }
  if (!NodeList.prototype.last) {
    /**
     * This property returns the last Node of the current NodeList.
     */
    NodeList.prototype.last = function _lastNode() {
      let _arr = Array.from(this);
      return _arr[_arr.length - 1];
    };
  }
  if (!NodeList.prototype.on) {
    NodeList.prototype.on = function () {
      this.forEach(node => Node.prototype.addEventListener.apply(node, arguments));
    }
  }
  if (!NodeList.prototype.off) {
    NodeList.prototype.off = function () {
      this.forEach(node => Node.prototype.removeEventListener.apply(node, arguments));
    }
  }
  // ============================================================
  // Element extensions
  // ============================================================
  if (!Element.prototype.hasOwnProperty("ariaset")) {
    /**
     * This property is intended to provide a behavior analogue to the `.dataset` property but for `aria-` attributes. As the set of valid `aria-` attributes is quite static, this property returns an object containing all of them, independent of whether they are set or not. Therefore the returned object may contain a number of `null` values.
     */
    Object.defineProperty(Element.prototype, "ariaset", {
      get: function () {
        const ariaset = {};
        for (let attr in this) {
          if (/^aria/.test(attr)) {
            let attrName = attr.replace(
              /([A-Z])/g,
              (match) => `-${match.toLowerCase()}`
            );
            let name = attr
              .replace("aria", "")
              .replace(/(^[A-Z])/, (match) => match.toLowerCase());
            Object.defineProperty(ariaset, name, {
              get: () => this[attr] || this.getAttribute(attrName),
              set: (val) => this.setAttribute(attrName, (this[attr] = val))
            });
          }
        }
        return ariaset;
      }
    });
  }
  if (!Element.prototype.hasOwnProperty("isInViewport")) {
    /**
     * This property returns `true` or `false`, dependent on whether the current element is located *within the current viewport* but independent of whether the element actually visible or not.
     */
    Object.defineProperty(Element.prototype, "isInViewport", {
      get: function () {
        let bounding = this.getBoundingClientRect();
        return (
          bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
          bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
        );
      }
    });
  }
  if (!Element.prototype.hasOwnProperty("isVisible")) {
    Object.defineProperty(Element.prototype, "isVisible", {
      get: function () {
        if (this.offsetParent === null) {
          let box = this.getBoundingClientRect();
          return box.height > 0 &&
            box.width > 0 &&
            !this.matches('[type="hidden"]') &&
            !this.hidden &&
            this.style.display !== "none" &&
            this.style.opacity !== 0 &&
            this.style.visibility !== "hidden";
        }
        return this.offsetParent !== null;
      }
    });
  }
  if (!Element.prototype.on) {
    Element.prototype.on = function () {
      Element.prototype.addEventListener.apply(this, arguments);
    }
  }
  if (!Element.prototype.off) {
    Element.prototype.off = function () {
      Element.prototype.removeEventListener.apply(this, arguments);
    }
  }
  if (!Element.prototype.up) {
    /**
     * This method moves the current element upwards within its parent element by one step.
     */
    Element.prototype.up = function _elementUp() {
      this.parent.insertBefore(this, this.prevSibling);
      return this;
    };
  }
  if (!Element.prototype.down) {
    /**
     * This method moves the current element downwards within its parent element by one step.
     */
    Element.prototype.down = function _elementDown() {
      this.parent.insertBefore(this, this.nextSibling);
      return this;
    };
  }
  if (!Element.prototype.asFirst) {
    /**
     * This method moves the current element to the start of its parent element. The current element becomes the first child of its parent.
     */
    Element.prototype.asFirst = function _asFirstElement() {
      this.parentNode.insertBefore(this, this.parentNode.children[0]);
      return this;
    };
  }
  if (!Element.prototype.asLast) {
    /**
     * This method moves the current element to the end of its parent element. The current element becomes the last child of its parent.
     */
    Element.prototype.asLast = function _asLastElement() {
      this.parentNode.appendChild(this);
      return this;
    };
  }
  if (!Element.prototype.sort) {
    /**
     * This method is intended to enable sorting of a list of elements within their parent.
     * @param {object} options - a set of options to configure how elements get sorted.
     * @param {string} options.sortBy - an attribute or property name to be used as sort-by for the elements (defaults to `innerText`)
     * @param {boolean} options.hidden - determine whether the elements are supposed to be sorted secretly, if yes a specified css-class `sort--hidden` is added to the containing parent element to allow custom styling for the sorting state.
     * @param {boolean} [options.useDataset=false] - determine whether to use a `data-` attribute given within `options.sortBy`. This will be set to `true` automatically if `options.sortBy` contains `'data-'`.
     */
    Element.prototype.sort = function _sortElement(options) {
      if (options && options.sortBy.indexOf("data-") > -1) {
        options.useDataset = true;
        options.sortBy = options.sortBy.replace("data-", "");
      }
      options = Object.assign(
        {
          sortBy: "innerText",
          hidden: false
        },
        options
      );
      if (options.hidden) {
        this.classList.add("sort--hidden");
      }
      const arr = [...this.children];
      arr.sort((a, b) => {
        const _a = Math.abs(
          (options.useDataset
            ? a.dataset[options.sortBy]
            : a[options.sortBy]
          ).replace("_", "")
        );
        const _b = Math.abs(
          (options.useDataset
            ? b.dataset[options.sortBy]
            : b[options.sortBy]
          ).replace("_", "")
        );
        return _a < _b ? -1 : _a > _b ? 1 : 0;
      });
      arr.forEach((item) => this.appendChild(item));
      if (options.hidden) {
        this.classList.remove("sort--hidden");
      }
    };
  }
  if (!Element.prototype.trigger) {
    /**
     * Add a trigger() method to trigger native events on the current element
     * Inspired by the jQuery method of the same name.
     */
    Element.prototype.trigger = function (eventName) {
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent(eventName, true, true);
      this.dispatchEvent(evt);
    };
  }
  if (!Element.prototype.show) {
    /**
     * This method shows the current element.
     */
    Element.prototype.show = function () {
      if (!this.hidden) {
        return false;
      }
      this.setAttribute('aria-hidden', (this.hidden = false));
    };
  }
  if (!Element.prototype.hide) {
    /**
     * This method hides the current element.
     */
    Element.prototype.hide = function () {
      if (this.hidden) {
        return false;
      }
      this.setAttribute('aria-hidden', (this.hidden = true));
    };
  }
  if (!Element.prototype.toggle) {
    /**
     * This method toggles whether the current element is shown or hidden
     * with either the use of the HTML5 "hidden" attribute or fading
     */
    Element.prototype.toggle = function (options) {
      let _settings = {
        fade: false,
        fadeOutDuration: 150,
        fadeInDuration: 300,
      };
      let _t = about(options).type;
      switch (_t) {
        case "boolean":
          _settings.fade = options;
          break;
        case "number":
          _settings = {
            fade: true,
            fadeInDuration: options,
            fadeOutDuration: options / 2
          }
          break;
        case "array":
          _settings.fade = true;
          if (options.length > 1) {
            _settings.fadeInDuration = options[0];
            _settings.fadeOutDuration = options[1];
            break;
          }
          _settings.fadeInDuration = options[0];
          _settings.fadeOutDuration = options[0] / 2;
          break;
        case "object":
          _settings = Object.assign(_settings, options);
          break;
        default:
          console.log(`Found argment of invalid type '${_t}' for Element.prototype.toggle method.`);
          break;
      }
      if (!_settings.fade) {
        this.hidden = !this.hidden;
      } else {
        this.isVisible ? this.fadeOut(_settings.fadeOutDuration) : this.fadeIn(_settings.fadeInDuration);
      }
    };
  }
  if (!Element.prototype.fadeOut) {
    Element.prototype.fadeOut = function (duration = 150) {
      if (this.isVisible) {
        let el = this;
        el.style.opacity = 1;
        (function fade() {
          if ((el.style.opacity -= .1) <= 0) {
            el.hidden = true;
            el.removeAttribute('style');
            el.dispatchEvent(theme.events.fade.out.end);
          } else {
            setTimeout(() => requestAnimationFrame(fade), duration / 10);
          }
        })();
      }
    }
  }
  if (!Element.prototype.fadeIn) {
    Element.prototype.fadeIn = function (duration = 300) {
      if (!this.isVisible) {
        let el = this;
        el.hidden = false;
        el.style.opacity = 0;
        (function fade() {
          let val = parseFloat(el.style.opacity);
          if ((val += .1) < 1) {
            el.style.opacity = val;
            setTimeout(() => requestAnimationFrame(fade), duration / 10);
          } else {
            el.removeAttribute('style');
            el.dispatchEvent(theme.events.fade.in.end);
          }
        })();
      }
    }
  }
  if (!Element.prototype.accordion) {
    /* ACCORDION PROTOTYPING */
    Element.prototype.accordion = function (options) {
      return new Accordion(this, options);
    }
  }

  // ============================================================
  // Date extensions
  // ============================================================
  if (!Date.prototype.diff) {
    Date.prototype.diff = function (date) {
      if (about(date).type === 'object') { return date };
      if ('date number'.indexOf(about(date).type) === -1) {
        console.warn('Parameter is no valid date object nor timestamp');
        return null;
      }
      let diff = this.getTime() - (about(date).type === 'date' ? date.getTime() : date);
      return {
        days: Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24)),
        hours: Math.floor(Math.abs(diff) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
        minutes: Math.floor(Math.abs(diff) % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(Math.abs(diff) % (1000 * 60) / 1000),
        past: diff > 0
      };
    }
  }
}(document, window);