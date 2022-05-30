import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

window.onload = () => {
  // admin인지 확인하기
};
const registerItemsBtn = document.querySelector('#registerItemsBtn');
const manageItemsBtn = document.querySelector('#manageItemsBtn');
const orderListBtn = document.querySelector('#orderListBtn');
// 요소(element), input 혹은 상수
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
  registerItemsBtn.addEventListener('click', () => {
    window.location.href = '/admin/register';
  });
  manageItemsBtn.addEventListener('click', () => {
    window.location.href = '/admin/manage';
  });
  lookupItemsBtn.addEventListener('click', () => {
    window.location.href = '/admin/order_list';
  });
}
