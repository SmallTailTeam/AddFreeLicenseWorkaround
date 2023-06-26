// ==UserScript==
// @name         AddFreeLinceseWorkaround
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Meow
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const parseCookie = str => str.split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
    }, {});

function sendRequest(subId) {
    let cookieRaw = document.querySelector('#cookieField').value
    let cookie = parseCookie(cookieRaw);

    let data = new URLSearchParams();
    data.set('ajax', 'true');
    data.set('sessionid', cookie.sessionid);

    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://checkout.steampowered.com/checkout/addfreelicense/' + subId,
        cookie: cookieRaw,
        anonymous: true,
        data: `${data}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(resp) {
            alert("Добавлено!");
        },
        onerror: function() {
            alert("Ошибка добавления!");
        },
    });
}

function getSubId() {
    let button = document.querySelector('#game_area_purchase > div.game_area_purchase_game > div.game_purchase_action > div > div.btn_addtocart.btn_packageinfo > span');

    if(button) {
        let onClickText = button.getAttribute('onclick');
        let match = onClickText.match(/AddFreeLicense\(\s(\d+),\s".*?"\s\);/);
        return match[1];
    }

    let forms = document.getElementsByTagName('form');

    for (let form of forms) {
        if (form.name.includes('add_to_cart_')) {
            return form.name.replace('add_to_cart_', '');
        }
    }

    return undefined;
}

(function() {
    'use strict';

    let subId = getSubId();

    console.log(subId);

    if (!subId) {
        return;
    }

    let buttons = document.querySelector('.game_purchase_action_bg');

    let custom = document.createElement('button');
    custom.innerHTML = 'Добавить FIXED';

    custom.addEventListener("click", () => {
        sendRequest(subId);
    });

    buttons.appendChild(custom);

    let cookieField = document.createElement('input');
    cookieField.id = 'cookieField';
    cookieField.placeholder = 'Куки';

    buttons.appendChild(cookieField);
})();
