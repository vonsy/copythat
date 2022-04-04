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
    const sign = '来自地板带着爱';
    const autoDecode = false;
    let fastpostmessage = document.querySelector('#fastpostmessage');
    let fastpostsubmit = document.querySelector('#fastpostsubmit');
    let fastpostrefresh = document.querySelector('#fastpostrefresh');
    let parent = fastpostrefresh.parentNode

    //*******************************************************//
    //*     Core Values Encoder                              //
    //*     https://sym233.github.io/core-values-encoder     //
    //*******************************************************//
    function assert(...express){
        const l = express.length;
        const msg = (typeof express[l-1] === 'string')? express[l-1]: 'Assert Error';
        for(let b of express){
            if(!b){
                throw new Error(msg);
            }
        }
    }

    function randBin(){
        return Math.random() >= 0.5;
    }

    const values = '富强民主文明和谐自由平等公正法治爱国敬业诚信友善';
    // const values = '嫐嬲巭勥奣忈恏嫑嘦嘂炛圐圙玊砳氼兲槑囧烎扌驫犇骉';
    // const values = '严禁发布转帖回复一切社会时政评论无论国内外来源嘂';

    function str2utf8(str){
        // return in hex

        const notEncoded = /[A-Za-z0-9\-\_\.\!\~\*\'\(\)]/g;
        const str1 = str.replace(notEncoded, c=>c.codePointAt(0).toString(16));
        let str2 = encodeURIComponent(str1);
        const concated = str2.replace(/%/g, '').toUpperCase();
        return concated;
    }

    function utf82str(utfs){
        assert(typeof utfs === 'string', 'utfs Error');

        const l = utfs.length;

        assert((l & 1) === 0);

        const splited = [];

        for(let i = 0; i < l; i++){
            if((i & 1) === 0){
                splited.push('%');
            }
            splited.push(utfs[i]);
        }

        return decodeURIComponent(splited.join(''));
    }

    function hex2duo(hexs){
        // duodecimal in array of number

        // '0'.. '9' -> 0.. 9
        // 'A'.. 'F' -> 10, c - 10    a2fFlag = 10
        //          or 11, c - 6      a2fFlag = 11
        assert(typeof hexs === 'string')

        const duo = [];

        for(let c of hexs){
            const n = Number.parseInt(c, 16);
            if(n < 10){
                duo.push(n);
            }else{
                if(randBin()){
                    duo.push(10);
                    duo.push(n - 10);
                }else{
                    duo.push(11);
                    duo.push(n - 6);
                }
            }
        }
        return duo;
    }

    function duo2hex(duo){
        assert(duo instanceof Array);

        const hex = [];

        const l = duo.length;

        let i = 0;

        while(i < l){
            if(duo[i] < 10){
                hex.push(duo[i]);
            }else{
                if(duo[i] === 10){
                    i++;
                    hex.push(duo[i] + 10);
                }else{
                    i++;
                    hex.push(duo[i] + 6);
                }
            }
            i++;
        }
        return hex.map(v=>v.toString(16).toUpperCase()).join('');
    }


    function duo2values(duo){
        return duo.map(d=>values[2*d]+values[2*d+1]).join('');
    }

    function valuesDecode(encoded){
        const duo = [];

        for(let c of encoded){
            const i = values.indexOf(c);
            if(i === -1){
                continue;
            }else if(i & 1){
                continue;
            }else{
                // i is even
                duo.push(i >> 1);
            }
        }

        const hexs = duo2hex(duo);

        assert((hexs.length & 1) === 0);

        let str;
        try{
            str = utf82str(hexs);
        }catch(e){
            throw e;
        }
        return str;
    }

    function valuesEncode(str){
        return duo2values(hex2duo(str2utf8(str)));
    }

    let btnCore = document.createElement('button');
    btnCore.id = 'btnCore';
    btnCore.type = 'submit';
    btnCore.textContent = '和谐';
    btnCore.style.marginRight = '5px';
    btnCore.onclick = function(){
        if (fastpostmessage.value && fastpostmessage.value.indexOf(sign !== -1)) {
            fastpostmessage.value = valuesEncode(fastpostmessage.value) + `   [url=https://github.com/vonsy/copythat][size=1]${sign}[/size][/url]`;
        }
    }

    if (!document.querySelector('#btnCore')) {
        parent.insertBefore(btnCore,fastpostrefresh);
    }

    let authorinfo = document.querySelectorAll('.authorinfo');
    let msgList = document.querySelectorAll('.t_msgfont');

    let btnDecode = document.createElement('button');
    btnDecode.textContent = '和谐';
    btnDecode.onclick = function(){
        let msgElement = this.parentNode.parentNode.parentNode.nextSibling.nextSibling.querySelector('.t_msgfont');
        let msgContent = msgElement.textContent;
        if (msgContent.indexOf(sign)!==-1){
            let msgWithoutSign = msgContent.replace(sign,'').trim();
            msgElement.textContent = valuesDecode(msgWithoutSign);
            this.textContent = '已和谐';
        }
    }

    for (let i=0;i<msgList.length;i++){
        let msg = msgList[i].textContent;
        if (msg.indexOf(sign) !== -1) {
            authorinfo[i].appendChild(btnDecode);
            if (autoDecode){
                msgList[i].textContent = msg;
                msgList[i].style.backgroundColor = 'lightgreen';
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.textContent = valuesDecode(msg.replace(sign,'').trim());
                tr.appendChild(td);
                msgList[i].parentNode.parentNode.insertBefore(tr,msgList[i].parentNode);
            }
        }
    }
})();
