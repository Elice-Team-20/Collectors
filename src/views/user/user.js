import * as Api from '/api.js';
import { selectElement, addCommas } from '/useful-functions.js';
import {
  addNavEventListeners,
  addNavElements,
  checkUserStatus,
  handleHamburger,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const orderListBtn = selectElement('#orderListBtn');
const editUserInfoBtn = selectElement('#editUserInfoBtn');
const resignBtn = selectElement('#resignBtn');

let isAdmin;
console.log(isAdmin);

window.onload = async () => {
  if (!checkUserStatus()) {
    alert('로그인 정보가 없습니다.');
    return;
  }
};
await userInit();
await addAllElements();
await addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  console.log(isAdmin);
  if (isAdmin) await addAdminMenuElements();
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  addBtnEvents();
  if (isAdmin) await addAdminBtnEvents();
}

async function userInit() {
  //관리자 토큰 받아오기
  const data = await Api.get('/api/user/isAdmin');
  localStorage.setItem('isAdmin', JSON.stringify(data.result));
  isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
}
async function addAdminMenuElements() {
  selectElement('.menu-container').insertAdjacentHTML(
    'beforeend',
    `
      <button class="menu" id="adminBtn">
        <i class="fa-solid fa-user-lock"></i>
        관리자 페이지
      </button>
    `,
  );
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
}
async function addAdminBtnEvents() {
  selectElement('#adminBtn').addEventListener('click', () => {
    window.location.href = '/admin';
  });
}
