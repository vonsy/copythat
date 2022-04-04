// ==UserScript==
// @name         D板Clippy
// @namespace    https://github.com/vonsy
// @version      0.0.1
// @description  D板大眼夹,一些小功能.
// @author       fsy <fsy@outlook.com>
// @license      MIT License
// @match        https://www.hi-pda.com/forum/viewthread.php*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/vonsy/copythat/main/copythat.meta.js
// @downloadURL  https://raw.githubusercontent.com/vonsy/copythat/main/copythat.user.js
// @homepageURL  https://github.com/vonsy/copythat
// @supportURL   https://github.com/vonsy/copythat/issues
// ==/UserScript==

'use strict';

(function() {
    const sign = '上海加油';
    let fastpostmessage = document.querySelector('#fastpostmessage');
    let fastpostsubmit = document.querySelector('#fastpostsubmit');
    let fastpostrefresh = document.querySelector('#fastpostrefresh');
    let parent = fastpostrefresh.parentNode

    let btn = document.createElement('button');
    btn.id = 'btnWithSign';
    btn.type = 'submit';
    btn.textContent = '戳我戳我';
    btn.onclick = function(){
        if (fastpostmessage.value) {
            fastpostmessage.value += `   [size=1]${sign}[/size]`;
        }
    }
    parent.insertBefore(btn,fastpostrefresh);
})();
