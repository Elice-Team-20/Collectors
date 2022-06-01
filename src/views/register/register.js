import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButton = document.querySelector('#submitButton');

const naverBtn = document.querySelector('#naverBtn');
const kakaoBtn = document.querySelector('#kakaoBtn');
const googleBtn = document.querySelector('#googleBtn');

addAllElements();
addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  submitButton.addEventListener('click', handleSubmit);
  naverBtn.addEventListener('click', handleNaverBtn);
  kakaoBtn.addEventListener('click', handleKakaoBtn);
  googleBtn.addEventListener('click', handleGoogleBtn);
}

// 회원가입 진행
async function handleSubmit(e) {
  e.preventDefault();

  const fullName = fullNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  // 잘 입력했는지 확인
  const isFullNameValid = fullName.length >= 2;
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === passwordConfirm;

  if (!isFullNameValid || !isPasswordValid) {
    return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
  }

  if (!isEmailValid) {
    return alert('이메일 형식이 맞지 않습니다.');
  }

  if (!isPasswordSame) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  // 회원가입 api 요청
  try {
    const data = { fullName, email, password };

    await Api.post('/api/user/register', data);

    alert(`정상적으로 회원가입되었습니다.`);

    // 로그인 페이지 이동
    window.location.href = '/login';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function handleNaverBtn() {
  try {
    const res = await Api.get('/api/auth/naver');
    console.log(res);
    alert(`정상적으로 회원가입되었습니다.`);

    window.location.href = '/login';
  } catch (err) {
    console.log(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function handleKakaoBtn() {
  try {
    await Api.get('/api/auth/kakao/start');
    alert('정상적으로 회원가입되었습니다.');
    window.location.href = '/login';
  } catch (err) {
    console.log(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function handleGoogleBtn() {
  try {
    await Api.get('/api/auth/naver');
    alert('정상적으로 회원가입되었습니다.');
    window.location.href = '/login';
  } catch (err) {
    console.log(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
