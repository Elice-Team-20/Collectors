import { addNavEventListeners, addNavElements } from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const submitButton = document.querySelector('#submitButton');
const passwordInput = document.querySelector('#passwordInput');
const token = localStorage.getItem('token');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('Signout');
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  submitButton.addEventListener('click', handleSubmit);
}

// 회원 탈퇴
async function handleSubmit(e) {
  e.preventDefault();

  // 유저 id 가져오기
  const userId = await findUserId();

  // 비밀번호 찾기 -> 너무 많은 fetch인가..? 성능적 의문(오히려 pw도 findUserId에서 요청하는 것이 나은가?)
  const response = await fetch(`/api/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();

  const { userPassword } = userData;

  // 비밀번호 일치 여부 확인
  // 변환된 비밀번호와 입력하는 비밀번호가 다른데 어떻게 일치 시키지..?
  // 소셜 로그인의 경우 이 부분을 어떻게 구현해야 할지..
  if (passwordInput !== userPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 회원 탈퇴(삭제 요청)
  await fetch(`/api/user/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('삭제가 완료되었습니다.');
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
  console.log(response);
  const userId = await response.json();
  console.log(userId);

  return userId;
}
