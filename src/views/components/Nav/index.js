export const Nav = (isLoggedIn, page) => {
  const loginMenu = isLoggedIn? `<li><div id="logoutMenu">로그아웃</div></li><li><a href='/user'>계정 관리</a></li>` 
      : `<li><a href="/login">로그인</a></li><li><a href='/register'>회원가입</a></li>`;
  let menu = ''
  if(page==="Login"){
    menu=`
    <li><a href="/register">회원가입</a></li>
    <li><a href="#cart">장바구니</a></li>
    `
  } else if(page === "Register"){
    menu=`
    ${loginMenu}
    <li><a href="#cart">장바구니</a></li>
    `
  } else{
    menu=`
    ${loginMenu}
    <li><a href="#cart">장바구니</a></li>
    `
  }
  return `
    <div class="navContainer">
      <div class="navBrand">
        <a href="/"><span>Marvel Store</span></a>
      </div>

      <div class="navMenuContainer">
        <ul id="navMenuList">
          ${menu}
        </ul>
      </div>
    </div>`
}
export default Nav;