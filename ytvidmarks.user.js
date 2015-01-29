// ==UserScript==
// @namespace https://bitbucket.org/jcarrelli
// @name YouTube Video Bookmarks
// @version 0.1a1
// @include https://www.youtube.com/user/*/videos?flow=list&sort=dd&view=0
// @require util.js
// @grant GM_getValue
// @grant GM_setValue
// ==/UserScript==

var USER = /user\/([A-Za-z0-9]+)/;
var VIDEOS = 'ul#browse-items-primary';
var VIDEO = 'li.browse-list-item-container';
var VIDEOLINK = 'h3.yt-lockup-title>a';
var VIDEOID = /v=([\w-]+)/;
var VIDEOMARK = 'ul.yt-lockup-meta-info';
var LOAD = 'button.load-more-button';

var BOOKMARK = '<p style=color:blue>Bookmark</p>';
var BOOKMARKED = '<p style=color:red>Bookmarked</p>';

function getUser() {
    return location.pathname.match(USER)[1];
}

function isMarked() {
    return false;
}

function appendButton(el, id) {
    var user = getUser();
    var marked = GM_getValue(user);

    isMarked = function () {
        return !isString(marked);
    };

    appendButton = function (el, id) {
        var button = document.createElement('button');
        button.innerHTML = BOOKMARK;
        button.onclick = function () {
            GM_setValue(user, id);
            if (marked instanceof Element)
                marked.innerHTML = BOOKMARK;
            marked = button;
            marked.innerHTML = BOOKMARKED;
        };
        el.appendChild(button);
        if (id === marked) {
            button.onclick();
            button.scrollIntoView(false);
        }
    };

    appendButton(el, id);
}

function getID(video) {
    return $(video, VIDEOLINK).search.match(VIDEOID)[1];
}

function appendButtons(videos) {
    for (let video of $$(videos, VIDEO))
        appendButton($(video, VIDEOMARK), getID(video));
}

function load() {
    var button = $(LOAD);
    if (!button)
        return false;
    button.click();
    return true;
}

function main() {
    var videos = $(VIDEOS);
    appendButtons(videos);
    new MutationObserver(function (changes) {
        for (let change of changes)
            for (let node of change.addedNodes)
                if (node.nodeType === Node.ELEMENT_NODE)
                    appendButtons(node);
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
