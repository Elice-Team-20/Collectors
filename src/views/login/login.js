import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');

const naverBtn = document.querySelector('#naverBtn');
const kakaoBtn = document.querySelector('#kakaoBtn');
const googleBtn = document.querySelector('#googleBtn');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('Login');
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  submitButton.addEventListener('click', handleSubmit);
  naverBtn.addEventListener('click', handleNaverBtn);
  kakaoBtn.addEventListener('click', handleKakaoBtn);
  googleBtn.addEventListener('click', handleGoogleBtn);
}

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert(
      '비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.',
    );
  }

  // 로그인 api 요청
  try {
    const data = { email, password };

    const result = await Api.post('/api/user/login', data);
    const token = result.token;

    // 로그인 성공
    localStorage.setItem('token', token);

    alert(`정상적으로 로그인되었습니다.`);

    // 기본 페이지로 이동
    window.location.href = '/';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
function handleNaverBtn(e) {
  e.preventDefault();
  window.location.href = '/api/auth/naver';
}
function handleKakaoBtn(e) {
  e.preventDefault();
  window.location.href = '/api/auth/kakao/start';
}
function handleGoogleBtn(e) {
  e.preventDefault();
  window.location.href = '/api/auth/google';
}
