// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { addCommas } from '/useful-functions.js';

import { addNavEventListeners, addNavElements } from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

import { OrderNav } from '../components/OrderNav.js'; // 주문 네비게이션 컴포넌트
import { OrderInfo } from '../components/OrderInfo.js'; // 결제정보 컴포넌트


const cartWrap = document.querySelector('.cart-wrap');
const infoWrap = document.querySelector('.info > h2');
const itemPrice = document.querySelector('#item-price');
const itemNumber = document.querySelector('#item-number');
const shipping = document.querySelector('#shipping');
const total = document.querySelector('#total');

addAllElements();
addAllEvents();

// Navigation Component 추가하는 역할
function addDefault() {
  cartWrap.insertAdjacentHTML('afterbegin', OrderNav('Cart'));
  infoWrap.insertAdjacentHTML('afterend', OrderInfo('Cart'));
}

async function addAllElements() {
  addNavElements();
  addFooterElements();
  insertItemElement();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners()
}

async function insertItemElement() {
  const response = await fetch(`/api/item`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const items = await response.json();
  console.log(items);
  items.item.forEach(({ itemName, mainExplanation, imgUrl, price }) => {
    console.log(imgUrl);
    ITEMLIST.insertAdjacentHTML(
      'beforeend',
      `
      <div class="item">
        <div class="imgBox">
          <figure>
            <img id="itemImage" src="${imgUrl}" alt="item-image" />
          </figure>
        </div>
        <div class="description">
          <div class="detail">
            <h1 id="itemName">${itemName}</h1>
            <p id="mainExplanation">${mainExplanation}</p>
          </div>
          <div>
            <h2 id="price">${addCommas(price)}원</h2>
          </div>
        </div>
      </div>
    `
    );
  });
}
