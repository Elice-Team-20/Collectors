import * as Api from '/api.js';
import { selectElement, addCommas } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

// 요소(element), input 혹은 상수
const quickMenu = selectElement('#quick-menu');
const quickItems = selectElement('.quick-items');
const soldoutContainer = selectElement('.soldout-container');
const categoryButton = selectElement('.category-expand');
const categoryList = selectElement('.category-list');

userInit();
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
  addNavElements();
  addFooterElements();
  addRecentItem();
  addSoldOutItems();
  addCategoryName();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  categoryButton.addEventListener('click', () => {
    categoryList.classList.toggle('hidden');
  });
}

// 장바구니 생성하기
function userInit() {
  let cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

// 이미지 슬라이더 설정
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  autoplay: {
    delay: 3000,
  },
  pauseOnMouseEnter: true,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// 퀵 메뉴 설정
window.onresize = () => {
  let x = window.innerWidth;
  x < 1250
    ? (quickMenu.style.display = 'none')
    : (quickMenu.style.display = 'block');
};

window.addEventListener('scroll', () => {
  let y = +window.scrollY;
  y > 250
    ? (quickMenu.style.top = y + 250 + 'px')
    : (quickMenu.style.top = '541px');
});

// 최근 본 상품 추가하기
function addRecentItem() {
  let recentItems = JSON.parse(localStorage.getItem('recentItem')) || [];

  if (!recentItems) return;

  // 추가하기
  recentItems.forEach(({ itemId, itemName, imgUrl }) => {
    const recentItemList = `
      <li class="recent-item">
        <a href="/item/?id=${itemId}">
          <img src="${imgUrl}" alt="${itemName}">
          <p>${itemName}</p>
        </a>
      </li>
    `;

    quickItems.insertAdjacentHTML('beforeend', recentItemList);
  });
}

// 매진 임박 추가 기능 구현하기
async function addSoldOutItems() {
  // 매진 임박 상품 가져오기
  const soldoutItemsData = await Api.get(`/api/item/soldOut`);

  // 매진 임박 상품 추가하기
  soldoutItemsData.forEach(({ _id, itemName, imgUrl, price, stocks }) => {
    const soldoutItemList = `
      <div class="soldout-item">
        <a href="/item/?id=${_id}">
          <div class="img-wrap" style="background-image: url(${imgUrl});">
          </div>
          <h3>${itemName}</h3>
          <p>${addCommas(price)}원</p>
          <p>단 ${stocks}개! 매진 임박</p>
        </a>
      </div>
    `;

    soldoutContainer.insertAdjacentHTML('beforeend', soldoutItemList);
  });
}

// 카테고리 가져오기
async function getCategoryName() {
  const categoryData = await Api.get(`/api/category`);

  return categoryData;
}

// 카테고리 메뉴 추가하기
async function addCategoryName() {
  const categoryNames = await getCategoryName();

  categoryNames.forEach((name) => {
    // ! 카테고리 작업 시 href 수정하기
    const categoryName = `<li class="category-item"><a href="items?category=${name}">${name}</a></li>`;
    categoryList.insertAdjacentHTML('beforeend', categoryName);
  });
}
