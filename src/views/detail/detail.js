import { addCommas, selectElement } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  checkUserStatus,
  handleHamburger,
} from '../components/Nav/event.js';

import { addFooterElements } from '../../components/Footer/event.js';

// url에서 id 값 추출해오기
const queryString = window.location.search;
const id = new URLSearchParams(queryString).get('id');
const itemLeftImgDiv = selectElement('.item-left');
const itemNameDiv = selectElement('#item-name');
const itemCompanyDiv = selectElement('#item-company');
const itemPriceDiv = selectElement('#item-price');
const itemExplanationDiv = selectElement('#item-explanation');
const cartBtn = selectElement('#addCartBtn');
const orderBtn = selectElement('#orderBtn');
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
  handleHamburger();
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
  itemPriceDiv.innerText = `${addCommas(price)}원`;
  itemExplanationDiv.innerText = mainExplanation;

  addRecentItem(id, itemName, imgUrl);
  addTagElements(hashTag);

  if (stocks <= 5) {
    addStockNumber();
  }
}

function addStockNumber() {
  const stockDiv = selectElement('#stock');
  stockDiv.innerHTML = `
  <i class="fa-regular fa-bell"></i>
  매진 임박 상품
  `;
}

// 태그 추가하기
function addTagElements(tags) {
  tags = tags[0].split(',');
  console.log('tags', tags);

  const tagListDiv = selectElement('#tagList');

  tagListDiv.innerHTML = tags.reduce((text, tag) => {
    return text + addTagElement(tag);
  }, ``);
}

function addTagElement(value) {
  return `<div class="tag-name">#${value}</div>`;
}

// 최근 본 상품 추가
function addRecentItem(itemId, itemName, imgUrl) {
  // 만료 기한 설정
  const expireDate = 1000 * 10;
  //1000 * 60 * 60 * 24; // 24시간

  // 최근 본 상품 로컬 스토리지에 저장할 데이터 구조
  const recentData = {
    itemId,
    itemName,
    imgUrl,
    expire: new Date().getTime() + expireDate,
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
