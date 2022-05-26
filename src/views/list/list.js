// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { addCommas } from '/useful-functions.js';

import { Nav } from '../components/Nav.js'; //네비게이션 컴포넌트
import { Footer } from '../components/Footer.js'; //푸터 컴포넌트

// GET / api/item/?id= ...

const ITEMLIST = document.querySelector('.item-list');
const nav = document.querySelector('nav');
const footer = document.querySelector('footer');

const isLoggedIn = checkUser()

addAllElements();
addAllEvents();

// 로그인 상태 확인
function checkUser(){
  return localStorage.getItem('token')? true : false
}
// Navigation Component 추가하는 역할
function addDefault(isLoggedIn) {
  nav.innerHTML = Nav(isLoggedIn, 'Register');
  footer.innerHTML = Footer();
}

async function addAllElements() {
  addDefault(isLoggedIn);
  insertItemElement();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  
}


async function insertItemElement() {
  const response = await fetch(`/api/item`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const items = await response.json();
  console.log(items);
  items.item.forEach(({ _id, itemName, mainExplanation, imgUrl, price }) => {
    console.log(_id);
    ITEMLIST.insertAdjacentHTML(
      'beforeend',
      `
      <a href="/items/detail/?id=${_id}">
        <div class="item">
          <div class="imgBox">
            <figure>
              <img id="itemImage" src="${imgUrl}" alt="item-image" />
            </figure>
          </div>
          <div class="description">
            <div class="detail">
              <h1 id="itemName">${itemName}</h1>
              <p id="mainExplanation">${mainExplanation}</p>
            </div>
            <div>
              <h2 id="price">${addCommas(price)}원</h2>
            </div>
          </div>
        </div>
      </a>
    `
    );
  });
}
