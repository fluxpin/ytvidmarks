function $(el, sel) {
    if (!sel) {
        sel = el;
        el = document;
    } else if (el.matches(sel)) {
        return el;
    }
    return el.querySelector(sel);
}

function $$(el, sel) {
    if (!sel) {
        sel = el;
        el = document;
    } else if (el.matches(sel)) {
        return [el];
    }
    return el.querySelectorAll(sel);
}

function createElement(html) {
    let template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
}

function isString(s) {
    return typeof s === 'string' || s instanceof String;
}
