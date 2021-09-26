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

(() => {

    function createButton(text, onclick) {
        const button = document.createElement('BUTTON');
        button.className = 'button';
        button.style.verticalAlign = 'middle';
        button.style.marginRight = '8px';
        button.innerHTML = text;
        button.href = 'javascript:void(0)';
        button.addEventListener('click', onclick);
        return button;
    }

    // 获取tid
    function getUrlParams(name) {
        var url = window.location.search;
        if (url.indexOf('?') == 1) { return false; }
        url = url.substr(1);
        url = url.split('&');
        var name = name || '';
        var nameres;

        for(var i=0;i<url.length;i++) {
            var info = url[i].split('=');
            var obj = {};
            obj[info[0]] = decodeURI(info[1]);
            url[i] = obj;
        }
        if (name) {
            for(var i=0;i<url.length;i++) {
                for (const key in url[i]) {
                    if (key == name) {
                        nameres = url[i][key];
                    }
                }
            }
        } else {
            nameres = url;
        }
        return nameres;
    }
    // 收藏
    function addfavorites(tid) {
        ajaxget('my.php?item=favorites&tid=' + tid, 'favorite_msg'); return false;
    }
    const observer = new MutationObserver(() => {
        const forwardLayer = document.querySelector('#fastpostform');
        if (!forwardLayer) return;

        const textarea = forwardLayer.querySelector('#fastpostmessage');
        const buttonBar = forwardLayer.querySelector('#fastpostsubmit').parentNode;
        const submit = forwardLayer.querySelector('#fastpostsubmit');

        if (!textarea || !buttonBar || !submit) return;

        const buttons = [];
        function disableAllButtons() {
            buttons.forEach((btn) => (btn.disabled = true));
        }

        buttons.push(createButton('𝓌𝒶𝓇𝒹', () => {
            var tid = getUrlParams("tid");
            addfavorites(tid);
            textarea.value = '插眼\n[img]https://www.hi-pda.com/forum/images/smilies/default/cool.gif[/img]';
            disableAllButtons();
            submit.click();
        }));

        buttons.forEach((btn) => buttonBar.insertBefore(btn, submit));
    });
    observer.observe(document.getElementById('fastpostmessage'), { subtree: true, attributes: true });

})();
