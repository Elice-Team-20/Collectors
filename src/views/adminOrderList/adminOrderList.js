import * as Api from '/api.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

window.onload = () => {
  // admin인지 확인하기
};
const orderListDiv = document.querySelector('.order-list');
// 요소(element), input 혹은 상수
await addAllElements();
await addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  addFooterElements();
  await addOrderListElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  document.querySelectorAll('.cancel-btn').forEach((node) => {
    node.addEventListener('click', handleCancelBtn);
  });
}

async function addOrderListElements() {
  const orderList = await getOrderInfo();
  console.log(orderList.length);
  const itemMap = await getItemInfo(orderList);
  orderListDiv.innerHTML = orderList.reduce(
    (text, { _id, orderDate, itemList, status }) => {
      const itemsDiv = itemList.reduce((text, { itemId, count }) => {
        if (itemMap[itemId] !== null) {
          const { itemName } = itemMap[itemId];
          return text + `<div>${itemName} / ${count}개</div>`;
        } else return text;
      }, ``);
      return (
        text +
        `
          <div class="order-data">
            <div class="order-id">${_id}</div>
            <div class="order-date">${orderDate}</div>
            <div class="order-name">${itemsDiv}</div>
            <div class="order-status">${status}</div>
            <button class="cancel-btn" id="cancelButton" name="${_id}">
              주문 취소
            </button>
          </div>
        `
      );
    },
    ``,
  );
}

async function getOrderInfo() {
  try {
    const orderList = await Api.get('/api/order');
    return orderList;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function getItemInfo(orderList) {
  try {
    let itemInfoMap = {};
    for (let i = 0; i < orderList.length; i++) {
      const { itemList } = orderList[i];
      for (let j = 0; j < itemList.length; j++) {
        const { itemId } = itemList[j];
        if (!itemInfoMap[itemId]) {
          const info = await Api.get(`/api/item/${itemId}`);
          itemInfoMap[itemId] = info;
        }
      }
    }
    return itemInfoMap;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function handleCancelBtn() {
  console.log(`취소 버튼 ${this.name}`);
  try {
    const res = await Api.delete('/api/order/admin/delete', '', {
      orderId: this.name,
    });
    alert('상품 삭제가 완료되었습니다.');
    // refresh
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
