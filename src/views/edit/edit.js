import { addNavEventListeners, addNavElements } from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수
const token = localStorage.getItem('token');
const submitButton = document.querySelector('#submitButton');
const addressButton = document.querySelector('#addressButton');
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const currentPasswordInput = document.querySelector('#currentPasswordInput');
const newPasswordInput = document.querySelector('#newPasswordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');

const postcode = document.querySelector('#postcode');
const address = document.querySelector('#address');
const detailAddress = document.querySelector('#detailAddress');
const extraAddress = document.querySelector('#extraAddress');

addAllElements();
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  addressButton.addEventListener('click', handleAddress);
  submitButton.addEventListener('click', updateUserData);
}

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('Edit');
  addFooterElements();

  getUserDataToInput();
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
        extraAddress.value = extraAddr;
      } else {
        extraAddress.value = '';
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      postcode.value = data.zonecode;
      address.value = addr;
      // 커서를 상세주소 필드로 이동한다.
      detailAddress.focus();
    },
  }).open();
}

async function getUserDataToInput() {
  // user 데이터 가져오기
  const id = await findUserId();

  // 유저 데이터 가져오기
  const response = await fetch(`/api/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();

  // 유저 데이터 가져와서 삽입
  const { fullName, email } = userData;
  fullNameInput.value = fullName;
  emailInput.innerHTML = email;

  // 주소 데이터 가져와서 삽입
  if (userData.address) {
    const { phoneNumber } = userData;
    const { postalCode, address1, address2 } = userData.address;
    console.log(phoneNumber, postalCode, address1, address2);
    postcode.value = postalCode;
    address.value = address1;
    detailAddress.value = address2;
    phoneNumberInput.value = phoneNumber;
  }
}

// 유저 아이디 찾기
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

// 유저 데이터 수정하기
async function updateUserData(e) {
  e.preventDefault();

  // 현재 비밀번호 확인
  const currentPassword = currentPasswordInput.value;

  if (!currentPassword) alert('현재 비밀번호를 입력하세요.');

  // id 가져오기
  const id = await findUserId();

  // 새로운 비밀번호 데이터
  const newPassword = newPasswordInput.value;
  const newPasswordConfirm = passwordConfirmInput.value;

  // 비밀번호 확인
  if (newPassword !== newPasswordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  if (newPassword.length < 8) {
    alert('비밀번호는 8자 이상이어야 합니다.');
    return;
  }

  // 수정할 유저 데이터
  const userData = {
    currentPassword: currentPassword,
    fullName: fullNameInput.value,
    password: newPassword,
    phoneNumber: phoneNumberInput.value,
    address: {
      postalCode: postcode.value,
      address1: address.value,
      address2: detailAddress.value,
    },
  };

  // 유저 데이터 수정하기
  const response = await fetch(`/api/user/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (response.status === 200 || response.status === 304) {
    alert('회원 정보가 수정되었습니다.');
    location.href = '/';
  } else {
    alert('회원 정보 수정에 실패하였습니다.');
  }
}
