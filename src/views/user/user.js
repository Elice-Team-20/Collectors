import * as Api from '/api.js';
import { selectElement, addCommas } from '/useful-functions.js';
import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const orderListBtn = selectElement('#orderListBtn');
const editUserInfoBtn = selectElement('#editUserInfoBtn');
const resignBtn = selectElement('#resignBtn');
const adminBtn = selectElement('#adminBtn');

window.onload = async () => {
  const { result } = await Api.get(`/api/user/isAdmin`);

  if (!result) {
    adminBtn.style.display = 'none';
  }
};

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  addBtnEvents();
}

function addBtnEvents() {
  orderListBtn.addEventListener('click', () => {
    window.location.href = '/user/orderlist';
  });
  editUserInfoBtn.addEventListener('click', () => {
    window.location.href = '/user/edit';
  });
  resignBtn.addEventListener('click', () => {
    window.location.href = '/user/resign';
  });
  adminBtn.addEventListener('click', () => {
    window.location.href = '/admin';
  });
}
