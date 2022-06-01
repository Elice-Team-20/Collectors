// Navigation을 컴포넌트화.
export const Nav = (isLoggedIn, page) => {
  const loginMenu = isLoggedIn
    ? `<li><div id="logoutMenu">로그아웃</div></li><li><a href='/user'>계정 관리</a></li>`
    : `<li><a href="/login">로그인</a></li><li><a href='/register'>회원가입</a></li>`;
  let menu = '';
  if (page === 'Login') {
    menu = `
    <li><a href="/register">회원가입</a></li>
    <li><a href="/cart">장바구니</a></li>
    `;
  } else if (page === 'Register') {
    menu = `
    ${loginMenu}
    <li><a href="/cart">장바구니</a></li>
    `;
  } else {
    menu = `
    ${loginMenu}
    <li><a href="/cart">장바구니</a></li>
    `;
  }
  return `
    <div class="navContainer">
      <div class="navBrand">
        <a href="/"><img src="https://team20.s3.ap-northeast-2.amazonaws.com/image/2e32c500e182-11ec-83b6-a91808427d79.png"/></a>
      </div>

      <div class="navMenuContainer">
        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul id="navMenuList" class="hidden">
          ${menu}
        </ul>
      </div>
    </div>`;
};
export default Nav;
