import * as Api from '/api.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';
import { checkAdmin } from '../../useful-functions.js';

window.onload = () => {
  // admin인지 확인하기
  if (!checkAdmin()) {
    alert('관리자 권한이 없습니다.');
    window.location.href = '/';
    return;
  }
};
const orderListDiv = document.querySelector('.order-list');

await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements('User');
  addFooterElements();
  await addOrderListElements();
}

function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  document.querySelectorAll('.cancel-btn').forEach((node) => {
    node.addEventListener('click', handleCancelBtn);
  });
  document.querySelectorAll('.change-btn').forEach((node) => {
    node.addEventListener('click', handleChangeBtn);
  });
}

async function addOrderListElements() {
  // 주문 내역 엘리먼트 함수
  const orderList = await getOrderInfo();
  const itemMap = await getItemInfo(orderList);
  orderListDiv.innerHTML = orderList.reduce(
    (text, { _id, orderDate, itemList, status }) => {
      const itemsDiv = itemList.reduce((text, { itemId, count }) => {
        if (itemMap[itemId] !== null) {
          const { itemName } = itemMap[itemId];
          return text + `<div>${itemName} / ${count}개</div>`;
        } else return text;
      }, ``);
      let isShipped = status === '배송 완료';
      return (
        text +
        `
          <div class="order-data">
            <div class="order-id">${_id}</div>
            <div class="order-date">${orderDate}</div>
            <div class="order-name ">${itemsDiv}</div>
            <div class="order-status ${
              isShipped ? 'shipped' : ''
            }">${status}</div>
            <button class="main-btn change-btn" name="${_id}" ${
          isShipped ? 'disabled' : ''
        }>
              상태 변경
            </button>
            <button class="main-btn cancel-btn" name="${_id}" ${
          isShipped ? 'disabled' : ''
        }>
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
  // 주문 내역 DB 가져오기..
  try {
    const orderList = await Api.get('/api/order');
    return orderList;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function getItemInfo(orderList) {
  // 상품 정보 가져오기
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
async function handleChangeBtn() {
  // 배송 상태 변경 버튼
  if (!confirm('주문 상태를 배송 완료로 변경하시겠습니까?')) return;
  try {
    await Api.post('/api/order/stat/update', {
      orderId: this.name,
    });
    await Api.post('/api/order/update/status', {
      orderId: this.name,
    });
    // const userId = await Api.get('/api/user/id');

    alert('주문 상태가 변경되었습니다.');
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function handleCancelBtn() {
  // 주문 취소 버튼
  if (!confirm('주문 내역을 삭제하시겠습니까?')) return;
  try {
    const res = await Api.delete('/api/order/admin/delete', '', {
      orderId: this.name,
    });
    alert('상품 삭제가 완료되었습니다.');
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
