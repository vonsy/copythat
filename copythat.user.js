// ==UserScript==
// @name         𝓗𝓲 𝓬𝓸𝓹𝔂 𝓽𝓱𝓪𝓽
// @namespace    https://github.com/vonsy
// @version      0.0.1
// @description  D板曲别针,一些小功能.
// @author       fsy <fsy@outlook.com>
// @license      Null
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
      textarea.value = '插眼\n[img=50,50]https://img02.hi-pda.com/forum/attachments/day_210917/21091722335df6f9c023564795.png[/img]';
      disableAllButtons();
      submit.click();
    }));

    buttons.forEach((btn) => buttonBar.insertBefore(btn, submit));
  });
  observer.observe(document.getElementById('fastpostmessage'), {subtree: true, attributes: true});

})();
