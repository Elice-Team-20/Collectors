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
const passwordInput = selectElement('#passwordInput');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('Resign');
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  window.onload = () => {
    alert(
      '소셜 로그인의 경우 해당 SNS 이름을 영어로 작성해주세요. \n예) naver, google, kakao',
    );
  };
  addNavEventListeners();
  handleHamburger();
  submitButton.addEventListener('click', handleSubmit);
}

// 회원 탈퇴
async function handleSubmit(e) {
  e.preventDefault();

  const confirm = window.confirm('정말로 탈퇴하시겠습니까?');

  if (!confirm) return;

  // 유저 id 가져오기
  const userId = await findUserId();
  const password = passwordInput.value;

  // 회원 탈퇴(삭제 요청)
  await Api.delete(`/api/user/delete/${userId}`, '', { password: password });

  localStorage.removeItem('token');
  alert('회원 탈퇴가 완료되었습니다.');
  window.location.href = '/';
}

// token으로 userId 찾기
async function findUserId() {
  return await Api.get(`/api/user/id`);
}
