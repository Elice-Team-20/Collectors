import { addNavEventListeners, addNavElements } from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수
const token = localStorage.getItem('token');
const orderInfo = document.querySelector('.order-info');

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
}

async function getDataToInput() {
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

    // 주문 데이터 HTML 추가
    orderInfo.insertAdjacentHTML(
      'beforeend',
      `
    <div class="order-list">
      <div class="order-number">${number}</div>
      <div class="order-date">${orderDate}</div>
      <div class="order-data">${items}</div>
      <div class="order-status">${status}</div>
      <button class="cancel" id="cancelButton" name="${orderId}">주문 취소</button>
    </div>
    `
    );
  });

  // 주문 취소 버튼 이벤트 추가
  const cancelButton = document.querySelectorAll('.cancel');
  cancelButton.forEach((node) => {
    node.addEventListener('click', handleCancelButton);
  });
}

async function findOrders() {
  // 주문 데이터 가져오기
  const response = await fetch(`/api/order/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const orders = await response.json();
  return orders;
}

async function handleCancelButton() {
  // 주문 취소 시 필요 데이터
  const id = this.getAttribute('name');
  const data = JSON.stringify({ orderId: id });

  // 주문 취소
  await fetch('/api/order/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  // 새로고침
  window.location.reload();
}
