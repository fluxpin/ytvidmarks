// ==UserScript==
// @namespace https://github.com/fluxpin
// @name YouTube Video Bookmarks
// @version 0.1a4
// @include https://www.youtube.com/user/*/videos?flow=grid&sort=dd&view=0
// @require util.js
// @grant GM.getValue
// @grant GM.setValue
// ==/UserScript==

var USER = /user\/([A-Za-z0-9]+)/;
var VIDEOS = 'ytd-grid-renderer>div#items';
var VIDEO = 'ytd-grid-video-renderer';
var VIDEOLINK = 'a#video-title';
var VIDEOID = /v=([\w-]+)/;
var VIDEOMARK = 'div#dismissable';
var LOAD = 'ytd-grid-renderer>div#continuations';

var BOOKMARK = '<p style=color:blue>Bookmark</p>';
var BOOKMARKED = '<p style=color:red>Bookmarked</p>';

function getUser() {
    return location.pathname.match(USER)[1];
}

function isMarked() {
    return false;
}

async function appendButton(el, id) {
    var user = getUser();
    var marked = await GM.getValue(user);

    isMarked = function () {
        return !isString(marked);
    };

    appendButton = async (el, id) => {
        var button = document.createElement('button');
        button.innerHTML = BOOKMARK;
        button.onclick = async () => {
            await GM.setValue(user, id);
            if (marked instanceof Element)
                marked.innerHTML = BOOKMARK;
            marked = button;
            marked.innerHTML = BOOKMARKED;
        };
        el.appendChild(button);
        if (id === marked) {
            await button.onclick();
            button.scrollIntoView(false);
        }
    };

    await appendButton(el, id);
}

function getID(video) {
    return $(video, VIDEOLINK).search.match(VIDEOID)[1];
}

async function appendButtons(videos) {
    for (let video of $$(videos, VIDEO))
        await appendButton($(video, VIDEOMARK), getID(video));
}

function load() {
    var button = $(LOAD);
    if (!button)
        return false;
    button.scrollIntoView(false);
    return true;
}

async function main() {
    var videos = $(VIDEOS);
    await appendButtons(videos);
    new MutationObserver(async (changes) => {
        for (let change of changes)
            for (let node of change.addedNodes)
                if (node.nodeType === Node.ELEMENT_NODE)
                    await appendButtons(node);
        if (!isMarked() && !load())
            alert('Video search failed');
    }).observe(videos, {childList: true});
    if (!isMarked() && !load())
        alert('Video search failed');
}

// We need to wait for the AJAX parts of the page to load before trying to
// load more videos. It's hard to detect this without cooperation from the
// page, so we hope that 500 ms is enough time.
setTimeout(main, 500);
