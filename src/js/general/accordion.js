export default class Accordion {
    constructor(el, options) {
        this.Element = el;
        this.Settings = Object.assign({
            toggleSelector: 'header, [class*="head"], [class*="-toggle"]',
            isOpen: true,
            allowMultipleOpen: false,
            allowCollapseAll: false
        }, options);

        this.Toggles = this.Element.querySelectorAll(this.Settings.toggleSelector);
        if (this.Toggles.length < 1) {
            console.warn("No element found that could be used as an accordion handle.");
            return false;
        }
        if (this.Settings.isOpen) {
            this.Toggles.forEach(t => t.parentNode.ariaset.current = false);
            this.Toggles[0].parentNode.ariaset.current = true;
        }
        this.Toggles.on('click', evt => this.ToggleSection(evt.currentTarget));
    }

    ToggleSection(toggle) {
        toggle.parentNode.ariaset.current = !toggle.parentNode.ariaset.current.toBoolean();
    }
}