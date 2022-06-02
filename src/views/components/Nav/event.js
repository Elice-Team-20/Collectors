import { Nav } from './index.js'; //네비게이션 컴포넌트

const nav = document.querySelector('nav');

// 로그인 상태 확인 함수
const checkUserStatus = () => {
  return localStorage.getItem('token');
};

const handleLogout = () => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  console.log(isAdmin);
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

const addNavElements = (page) => {
  const isLoggedIn = checkUserStatus();
  nav.innerHTML = Nav(isLoggedIn, page);
};
const addNavEventListeners = () => {
  const logoutMenu = document.querySelector('#logoutMenu');
  console.log(logoutMenu);
  if (logoutMenu) logoutMenu.addEventListener('click', handleLogout);
};

const handleHamburger = () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('#navMenuList');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    console.log('click');
  });
};

export {
  addNavEventListeners,
  addNavElements,
  handleLogout,
  checkUserStatus,
  handleHamburger,
};
