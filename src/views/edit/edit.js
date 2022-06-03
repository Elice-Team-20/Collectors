import * as Api from '/api.js';
import { selectElement } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수
const submitButton = selectElement('#submitButton');
const addressButton = selectElement('#addressButton');
const fullNameInput = selectElement('#fullNameInput');
const emailInput = selectElement('#emailInput');
const currentPasswordInput = selectElement('#currentPasswordInput');
const newPasswordInput = selectElement('#newPasswordInput');
const passwordConfirmInput = selectElement('#passwordConfirmInput');
const phoneNumberInput = selectElement('#phoneNumberInput');
const postcode = selectElement('#postcode');
const address = selectElement('#address');
const detailAddress = selectElement('#detailAddress');

addAllElements();
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  window.onload = () => {
    alert(
      '회원 정보를 수정하시려면 현재 비밀번호를 입력하세요.\n소셜 로그인의 경우 해당 SNS 이름을 영어로 작성해주세요. \n예) naver, google, kakao',
    );
  };
  addNavEventListeners();
  handleHamburger();
  addressButton.addEventListener('click', handleAddress);
  submitButton.addEventListener('click', updateUserData);
  currentPasswordInput.addEventListener('change', checkCurrentPassword);
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
      postcode.value = data.zonecode;
      address.value = data.address;
      detailAddress.value = '';
      detailAddress.focus();
    },
  }).open();
}

// 유저 데이터 삽입하기
async function getUserDataToInput() {
  // user 아이디 가져오기
  const id = await Api.get(`/api/user/id`);

  // 유저 데이터 가져오기
  const userData = await Api.get(`/api/user/${id}`);

  // 유저 데이터 가져와서 삽입
  const { fullName, email } = userData;
  fullNameInput.value = fullName;
  emailInput.innerHTML = email;

  // 주소 데이터 가져와서 삽입
  if (userData.address) {
    const { phoneNumber } = userData;
    const { postalCode, address1, address2 } = userData.address;
    postcode.value = postalCode;
    address.value = address1;
    detailAddress.value = address2;
    phoneNumberInput.value = phoneNumber;
  }
}

// 현재 비밀번호 입력 시 수정 가능
async function checkCurrentPassword() {
  // 현재 이메일과 입력 비밀번호
  const currentPassword = currentPasswordInput.value;
  const userEmail = emailInput.innerHTML;

  // 유저 비밀번호 확인
  const response = await fetch(`/api/user/checkPassword/${userEmail}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      userEmail: userEmail,
    },
    body: JSON.stringify({ password: currentPassword }),
  });

  const isMatched = response.json();

  // 비밀번호가 일치하지 않을 때
  if (!isMatched) {
    alert('현재 비밀번호를 정확히 입력하세요.');
    return;
  }

  // 비밀번호가 일치할 때
  fullNameInput.disabled = false;
  newPasswordInput.disabled = false;
  passwordConfirmInput.disabled = false;
  addressButton.disabled = false;
  postcode.disabled = false;
  address.disabled = false;
  detailAddress.disabled = false;
  phoneNumberInput.disabled = false;
  submitButton.disabled = false;
}

// 유저 데이터 수정하기
async function updateUserData(e) {
  // 확인하기
  const isConfirmed = confirm('정말로 수정하시겠습니까?');

  if (!isConfirmed) return;

  e.preventDefault();
  // 유저 아이디 가져오기
  const id = await Api.get(`/api/user/id`);

  // 현재 비밀번호 확인
  const currentPassword = currentPasswordInput.value;

  const newPassword = newPasswordInput.value;
  const newPasswordConfirm = passwordConfirmInput.value;

  if (fullNameInput.value.length < 2) {
    alert('이름을 2글자 이상 입력해주세요.');
    return;
  }

  // 전화번호 확인
  if (phoneNumberInput.value.length < 10) {
    alert('전화번호를 정확히 입력해주세요.');
    return;
  }

  // 비밀번호 입력 안할 시
  if (!newPassword) {
    const userData = {
      fullName: fullNameInput.value,
      phoneNumber: phoneNumberInput.value,
      currentPassword: currentPassword,
      address: {
        postalCode: postcode.value,
        address1: address.value,
        address2: detailAddress.value,
      },
    };

    // 유저 데이터 수정하기
    await Api.patch(`/api/user/users/${id}`, '', userData);
  } else {
    // 비밀번호 입력 시
    // 비밀번호 확인
    if (newPassword !== newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    const userData = {
      fullName: fullNameInput.value,
      phoneNumber: phoneNumberInput.value,
      currentPassword: currentPassword,
      password: newPassword,
      address: {
        postalCode: postcode.value,
        address1: address.value,
        address2: detailAddress.value,
      },
    };

    // 유저 데이터 수정하기
    await Api.patch(`/api/user/users/${id}`, '', userData);
  }

  alert('수정되었습니다.');
}
