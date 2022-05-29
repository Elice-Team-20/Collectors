import { addNavEventListeners, addNavElements } from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const token = localStorage.getItem('token');
const submitButton = document.querySelector('#submitButton');
const addressButton = document.querySelector('#addressButton');
const fullNameInput = document.querySelector('#fullNameInput');
const passwordInput = document.querySelector('#passwordInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');

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
  // addressButton.addEventListener('click', handleAddress);
}

async function getDataToInput() {
  // user id 가져오기
  const id = await findUserId();

  // 주문 데이터 가져오기
  const orderInfo = findOrders(id);

  const { postalCode } = orderInfo;
}

async function findUserId() {
  const response = await fetch(`/api/user/id`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const userId = await response.json();

  return userId;
}

async function findOrders(userId) {
  const response = await fetch(`/api/order/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const orders = await response.json();
  console.log(orders);
  return orders;
}
