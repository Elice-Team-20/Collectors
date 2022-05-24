export function makeHeader() {
  const NAVBAR = document.querySelector('#navbar');
  const isLogin = window.localStorage.getItem('token');
  let headerContent = '';

  // user 로그인 여부에 따라 내용 변경 필요.
  // how? -> window.localStorage.getItem(key);

  if (window.location.href === 'http://localhost:5000/login/') {
    // Login page : 회원 가입
    headerContent = `
    <li><a class="has-text-white" href="/register">회원가입</a></li>
    `;
  } else if (window.location.href === 'http://localhost:5000/register/') {
    // Register page : 로그인
    headerContent = `
    <li><a class="has-text-white" href="/login">로그인</a></li>
    `;
  } else if (!isLogin) {
    // HOME 비로그인 : 회원 가입 | 로그인
    headerContent = `
    <li><a class="has-text-white" href="/register">회원가입</a></li>
    <li><a class="has-text-white" href="/login">로그인</a></li>
    `;
  } else {
    // HOME 로그인 & 이후 모든 페이지: 계정 관리 | 로그아웃
    headerContent = `
    <li><a class="has-text-white" href="/register">계정관리</a></li>
    <li><a class="has-text-white" href="/logout">로그아웃</a></li>
    `;
  }

  NAVBAR.insertAdjacentHTML('afterbegin', headerContent);
}
