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

function isString(s) {
    return typeof s === 'string' || s instanceof String;
}
