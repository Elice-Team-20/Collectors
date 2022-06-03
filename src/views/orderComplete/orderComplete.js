import { addCommas } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  checkUserStatus,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

const orderInfo = JSON.parse(localStorage.getItem('orderInfo'));
window.onload = () => {
  if (!orderInfo || !checkUserStatus()) {
    alert('비정상적인 접근입니다.');
    window.location.href = '/';
  }
};

const orderListBtn = document.querySelector('#order-list-page-btn');
const itemsListBtn = document.querySelector('#items-list-page-btn');

addAllElements();
addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();

  // addOrderNavElements();
  addOrderFinishedInfoElments();
  // addOrderInfoElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  orderListBtn.addEventListener('click', () => {
    window.location.href = '/user/orderlist';
  });
  itemsListBtn.addEventListener('click', () => {
    window.location.href = '/items';
  });
}

function addOrderFinishedInfoElments() {
  const orderedItemDiv = document.querySelector('#orderedItem');
  const totalPriceDiv = document.querySelector('#totalPrice');

  orderedItemDiv.innerHTML = orderInfo.orderItemsText;
  totalPriceDiv.innerHTML = `${addCommas(orderInfo.totalCost)}원`;
}
function handleOrderListBtn() {
  window.location.href = '/orderlist';
}

window.onunload = () => {
  localStorage.removeItem('orderInfo');
};
