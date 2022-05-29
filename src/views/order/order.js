import { addCommas } from '/useful-functions.js';
import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import { addOrderNavElements } from '../components/Order/event.js';

const purchaseBtn = document.querySelector('#purchase-btn');
const orderList = JSON.parse(localStorage.getItem('order'));
let orderInfo = { orderList };
const shipFreeMinPrice = 50000;
console.log(orderList);
addAllElements();
addAllEvents();

function addAllElements() {
  addNavElements();
  addFooterElements();
  addOrderNavElements('Order');
  addOrderInfoElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  addNavEventListeners();
  purchaseBtn.addEventListener('click', purchaseBtnHandler);
}
function purchaseBtnHandler() {
  window.location.href = '/order/complete';
}

async function addOrderInfoElements() {
  const orderItemsDiv = document.querySelector('#orderItems');
  const itemTotalPriceDiv = document.querySelector('#itemTotalPrice');
  const shipFeeDiv = document.querySelector('#shipFee');
  const totalPriceDiv = document.querySelector('#totalPrice');

  const { orderItemsText, totalItemPrice, shipFee } = await getOrderItemInfos();
  console.log(orderItemsText);
  orderItemsDiv.innerHTML = orderItemsText;
  itemTotalPriceDiv.innerHTML = addCommas(totalItemPrice);
  shipFeeDiv.innerHTML = addCommas(shipFee);
  totalPriceDiv.innerHTML = addCommas(totalItemPrice + shipFee);
}

async function getOrderItemInfos() {
  let orderItemsText = ``;
  let totalItemPrice = 0;
  for (let i = 0; i < orderList.length; i++) {
    const [id, num] = orderList[i];
    const response = await fetch(`/api/item/${id}`);
    const info = await response.json();
    console.log(info);
    const { itemName, price } = info;
    orderItemsText += `<div>${itemName} / ${num}개</div>`;
    totalItemPrice += Number(price) * num;
  }

  let shipFee = totalItemPrice > shipFreeMinPrice ? 0 : 3000;
  orderInfo = {
    totalCost: totalItemPrice + shipFee,
  };
  return { orderItemsText, totalItemPrice, shipFee };
}
