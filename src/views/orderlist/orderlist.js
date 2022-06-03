import * as Api from '/api.js';
import { selectElement } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수
const token = localStorage.getItem('token');
const orderInfo = selectElement('.order-info');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('Orders');
  addFooterElements();

  getDataToInput();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
}

async function getDataToInput() {
  try {
    // 주문 데이터 가져오기
    const orderInfos = await findOrders();

    // 주문 데이터 번호
    let number = 0;

    // 주문 데이터 HTML 추가하기
    orderInfos.forEach(({ orderId, itemList, orderDate, status }) => {
      // 주문 아이템 데이터
      const items = itemList
        .map(({ itemName, count }) => {
          return `${itemName} / ${count}개`;
        })
        .join('<br>');

      // 주문 데이터 번호 추가
      number += 1;

      // 주문 상태 확인
      let isShipped = status === '배송 완료';

      // 주문 데이터 HTML 추가
      orderInfo.insertAdjacentHTML(
        'beforeend',
        `
    <div class="order-list">
      <div class="order-number">${number}</div>
      <div class="order-date">${orderDate}</div>
      <div class="order-data">${items}</div>
      <div class="order-status ${isShipped ? 'shipped' : ''}">${status}</div>
      <button class="cancel-btn main-btn" id="cancelButton" name="${orderId}"${
          isShipped ? 'disabled' : ''
        }>주문 취소</button>
    </div>
    `,
      );
    });

    // 주문 취소 버튼 이벤트 추가
    const cancelButton = document.querySelectorAll('.cancel-btn');
    cancelButton.forEach((node) => {
      node.addEventListener('click', handleCancelButton);
    });
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function findOrders() {
  // 주문 데이터 가져오기
  try {
    const orderDataList = await Api.get(`/api/order/list`);
    return orderDataList;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function handleCancelButton() {
  try {
    const isConfirm = confirm('주문을 취소하시겠습니까?');

    if (!isConfirm) return;

    // 주문 취소 시 필요 데이터
    const id = this.getAttribute('name');
    const data = { orderId: id };

    // 주문 취소
    await Api.delete('/api/order/delete', '', data);

    alert('주문 취소가 완료되었습니다.');

    // 새로고침
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
