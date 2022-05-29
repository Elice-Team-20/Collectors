import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

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
  addNavElements('Edit');
  addFooterElements();

  getUserDataToInput();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  addressButton.addEventListener('click', handleAddress);
}

function handleAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = ''; // 주소 변수
      let extraAddr = ''; // 참고항목 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
      if (data.userSelectedType === 'R') {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        // 건물명이 있고, 공동주택일 경우 추가한다.
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
        }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
        if (extraAddr !== '') {
          extraAddr = ' (' + extraAddr + ')';
        }
        // 조합된 참고항목을 해당 필드에 넣는다.
        document.getElementById('extraAddress').value = extraAddr;
      } else {
        document.getElementById('extraAddress').value = '';
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById('postcode').value = data.zonecode;
      document.getElementById('address').value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById('detailAddress').focus();
    },
  }).open();
}

async function getUserDataToInput() {
  // user 데이터 가져오기
  const id = await findUserId();
  const response = await fetch(`/api/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();

  // 주문 데이터 가져오기
  const orderInfo = findOrders(id);

  const { fullName, password } = userData;

  fullNameInput.value = fullName;
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
