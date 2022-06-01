// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { addCommas } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';
import { checkUserStatus } from '../components/Nav/event.js';

// url에서 id 값 추출해오기
// const ITEMDETAIL = document.querySelector('.item-detail');
const queryString = window.location.search;
const id = new URLSearchParams(queryString).get('id');
const itemLeftImgDiv = document.querySelector('.item-left');
const itemNameDiv = document.querySelector('#item-name');
const itemCompanyDiv = document.querySelector('#item-company');
const itemPriceDiv = document.querySelector('#item-price');
const itemExplanationDiv = document.querySelector('#item-explanation');
const cartBtn = document.querySelector('#addCartBtn');
const orderBtn = document.querySelector('#orderBtn');
// console.log(item);
// navigation, footer 컴포넌트 넣기
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();

  await insertItemDetail(id);
}

async function addAllEvents() {
  addNavEventListeners();
  cartBtn.addEventListener('click', addCartBtnHandler);
  orderBtn.addEventListener('click', handleOrderBtn);
}

function handleOrderBtn() {
  if (checkUserStatus()) {
    let order = [[id, 1]]; // 아이템 하나
    console.log('order', order);
    localStorage.setItem('order', JSON.stringify(order));
    window.location.href = '/order';
  } else {
    alert('로그인 정보가 없습니다. 로그인 후에 주문이 가능합니다.');
    window.location.href = '/login';
  }
}

// 카트 추가
function addCartBtnHandler() {
  let currentCart = JSON.parse(localStorage.getItem('cart'));
  if (!currentCart) currentCart = [];
  currentCart.push(id);
  console.log('add cart', currentCart);
  localStorage.setItem('cart', JSON.stringify(currentCart));
  const goToCart = confirm('장바구니로 이동하시겠습니까?');
  if (goToCart) {
    window.location.href = '/cart';
  }
}

// 상세 페이지 렌더링 함수
async function insertItemDetail(id) {
  const response = await fetch(`/api/item/${id}`);
  const details = await response.json();
  const {
    itemName,
    category,
    manufacturingCompany,
    summary,
    mainExplanation,
    imgUrl,
    stocks,
    price,
    hashTag,
  } = details;
  itemLeftImgDiv.innerHTML = `<img src="${imgUrl}" alt="item-image" />`;
  itemNameDiv.innerText = itemName;
  itemCompanyDiv.innerText = manufacturingCompany;
  itemPriceDiv.innerText = price;
  itemExplanationDiv.innerText = mainExplanation;

  addRecentItem(id, itemName, imgUrl);
}

// 최근 본 상품 추가
function addRecentItem(itemId, itemName, imgUrl) {
  // 최근 본 상품 로컬 스토리지에 저장할 데이터 구조
  const recentData = {
    itemId,
    itemName,
    imgUrl,
  };

  // 최근 본 상품이 있는지 확인
  let recentItemList = JSON.parse(localStorage.getItem('recentItem'));

  // 없으면 새로 생성
  if (!recentItemList) recentItemList = [];

  // 동일한 상품이 있으면 추가하지 않음
  let isItemExist = false;

  isItemExist = recentItemList.some((item) => {
    return item.itemId == itemId;
  });

  if (!isItemExist) {
    // 3개 이상이면 첫 번째 아이템 삭제
    if (recentItemList.length === 3) recentItemList.shift();

    // 최근 본 상품 추가
    recentItemList.push(recentData);

    // 로컬 스토리지에 추가
    localStorage.setItem('recentItem', JSON.stringify(recentItemList));

    isItemExist = false;
  }
}
