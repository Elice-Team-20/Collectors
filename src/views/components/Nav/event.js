import { Nav } from './index.js'; //네비게이션 컴포넌트

const nav = document.querySelector('nav');

const checkUserStatus = () => {
  return localStorage.getItem('token') ? true : false;
};

const handleLogout = () => {
  const token = localStorage.getItem('token');
  if (token) {
    localStorage.removeItem('token');
    window.location.href = '/';
  } else {
    alert('token이 없는 상태입니다.');
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

export { addNavEventListeners, addNavElements, handleLogout };
