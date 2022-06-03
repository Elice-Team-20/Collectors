import { Nav } from './index.js'; //네비게이션 컴포넌트

const nav = document.querySelector('nav');

// 로그인 상태 확인 함수
const checkUserStatus = () => {
  return localStorage.getItem('token');
};

// 로그 아웃 함수
const handleLogout = () => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  if (token) {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  } else {
    alert('token이 없는 상태입니다.');
  }
  if (isAdmin) {
    localStorage.removeItem('isAdmin');
  }
};

// 네비게이션 엘리먼트 추가 함수
const addNavElements = (page) => {
  const isLoggedIn = checkUserStatus();
  nav.innerHTML = Nav(isLoggedIn, page);
};
// 네비게이션 이벤트 추가 함수
const addNavEventListeners = () => {
  const logoutMenu = document.querySelector('#logoutMenu');
  if (logoutMenu) logoutMenu.addEventListener('click', handleLogout);
};
// 햄버거 메뉴 버튼 이벤트 처리 함수
const handleHamburger = () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('#navMenuList');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
  });
};

export {
  addNavEventListeners,
  addNavElements,
  handleLogout,
  checkUserStatus,
  handleHamburger,
};
