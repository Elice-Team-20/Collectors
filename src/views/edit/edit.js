import * as Api from '/api.js';
import { selectElement } from '/useful-functions.js';

import { addNavEventListeners, addNavElements } from '../../components/Nav/event.js';
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
  addNavEventListeners();
  addressButton.addEventListener('click', handleAddress);
  submitButton.addEventListener('click', updateUserData);
}

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('Edit');
  addFooterElements();
  currentPasswordInput.addEventListener('change', checkCurrentPassword);
  getUserDataToInput();
}

function handleAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = ''; // 주소 변수
      let extraAddr = ''; // 참고항목 변수

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
  const isMatched = await Api.get(`/api/user/checkPassword/${userEmail}`);

  // 비밀번호가 일치하지 않을 때
  if (!isMatched) {
    alert('비밀번호를 정확히 입력하세요.');
    return;
  }
  // 비밀번호가 일치할 때
  fullNameInput.disabled = false;
  newPasswordInput.disabled = false;
  passwordConfirmInput.disabled = false;
  phoneNumberInput.disabled = false;
  postcode.disabled = false;
  address.disabled = false;
  detailAddress.disabled = false;
}

// 유저 데이터 수정하기
async function updateUserData(e) {
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
