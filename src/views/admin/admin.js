import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import { checkAdmin } from '../useful-functions.js';

window.onload = () => {
  // admin인지 확인하기
  if (!checkAdmin()) {
    alert('관리자 권한이 없습니다.');
    window.location.href = '/';
    return;
  }
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
  handleHamburger();
  addBtnEvents();
}

function addBtnEvents() {
  registerItemsBtn.addEventListener('click', () => {
    window.location.href = '/admin/register';
  });
  manageItemsBtn.addEventListener('click', () => {
    window.location.href = '/admin/manage';
  });
  orderListBtn.addEventListener('click', () => {
    window.location.href = '/admin/orderlist';
  });
}
