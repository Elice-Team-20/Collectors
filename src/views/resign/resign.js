import * as Api from '/api.js';
import { selectElement } from '/useful-functions.js';

import { addNavEventListeners, addNavElements, handleLogout } from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수
const token = localStorage.getItem('token');
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
    alert('소셜 로그인의 경우 해당 SNS 이름을 영어로 작성해주세요. \n예) naver, google, kakao');
  };
  addNavEventListeners();
  submitButton.addEventListener('click', handleSubmit);
}

// 회원 탈퇴
async function handleSubmit(e) {
  e.preventDefault();

  // 유저 id 가져오기
  const userId = await findUserId();
  const password = passwordInput.value;

  // 회원 탈퇴(삭제 요청)
  await fetch(`/api/user/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: password }),
  })
    .then(() => {
      console.log('삭제가 완료되었습니다.');
      handleLogout();
    })
    .catch((err) => {
      console.log(err);
      alert('비밀번호가 일치하지 않습니다.');
    });
}

// token으로 userId 찾기
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
