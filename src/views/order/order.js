import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import {
  addOrderNavElements,
  addOrderInfoElements,
} from '../components/Order/event.js';

const purchaseBtn = document.querySelector('#purchase-btn');
const order = JSON.parse(localStorage.getItem('order'));
console.log(order);
addAllElements();
addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
  addOrderNavElements('Order');
  // addOrderInfoElements("Order");
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  purchaseBtn.addEventListener('click', purchaseBtnHandler);
}
function purchaseBtnHandler() {
  window.location.href = '/order/complete';
}
