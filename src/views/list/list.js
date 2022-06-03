import * as Api from '/api.js';

import {
  addCommas,
  selectElement,
  removeExpiredItem,
} from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../components/Nav/event.js';

import { addFooterElements } from '../components/Footer/event.js';
import {
  addCategoryMenuElement,
  addCategoryMenuEventListeners,
  addCategoryName,
} from '../components/Category/event.js';
import {
  addQuickMenuElement,
  addQuickMenuEventListeners,
  handleTopButton,
} from '../components/QuickMenu/event.js';
import { addSearchBarElement } from '../components/SearchBar/event.js';

const itemList = selectElement('.item-list');
const categorySection = selectElement('#category');
const quickMenu = selectElement('#quick-menu');
const queryString = window.location.search;
const category = new URLSearchParams(queryString).get('category');

let items = []; // 전체 or 카테고리 아이템 담을 객체
let searchedItems = []; // 검색된 거 담을 객체

window.onload = () => {
  removeExpiredItem();
};

await initializeItems();
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
  addCategoryMenuElement(categorySection);
  addCategoryName(category);
  addQuickMenuElement(quickMenu);
  addSearchBarElement();
  insertItemElement();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  addCategoryMenuEventListeners();
  addQuickMenuEventListeners(quickMenu);
  handleTopButton();
  document
    .querySelector('#searchBarBtn')
    .addEventListener('click', handleSearchBtn);
}

async function initializeItems() {
  if (!category) items = await getAllItems();
  else items = await getCategoryItems();
}

async function insertItemElement() {
  let filteredItems = items;
  // 카테고리 내에서의 검색 결과 반영
  if (searchedItems.length !== 0) {
    filteredItems = items.filter(({ _id }) => {
      return searchedItems.some((val) => val === _id);
    });
  }
  if (filteredItems.length === 0) {
    // 카테고리 내 검색 결과가 없을 경우 알림
    alert('검색된 상품이 없습니다.');
    filteredItems = items; // 원래 검색 결과 보여주기
  }
  searchedItems = []; // 초기화
  itemList.innerHTML = '';
  filteredItems.forEach(
    ({ _id, itemName, summary, imgUrl, price, deleteFlag, stocks }) => {
      // 삭제된 상품, 재고 없는 상품 제외
      if (deleteFlag) return;
      if (stocks === 0) return;

      // 매진 임박 알림
      const aboutStock =
        stocks <= 5 ? `<i class="fa-regular fa-bell"></i>` : '';

      itemList.innerHTML += `
      <a href="/item/?id=${_id}">
        <div class="item">
          <div class="imgBox">
            <figure>
              <img id="itemImage" src="${imgUrl}" alt="item-image" />
            </figure>
          </div>
          <div class="description">
            <div class="detail">
              <h1 id="itemName"><div>${itemName}</div>${aboutStock}</h1>
              <p id="summary">${summary}</p>
            </div>
            <div>
              <h2 id="price">${addCommas(price)}원</h2>
            </div>
          </div>
        </div>
      </a>
    `;
    },
  );
}

// 모든 아이템 가져오기
async function getAllItems() {
  try {
    const result = await Api.get(`/api/item`);
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 카테고리 아이템 가져오기
async function getCategoryItems() {
  try {
    const result = await Api.get(`/api/item/category/${category}`);
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 검색 버튼 클릭
async function handleSearchBtn(e) {
  e.preventDefault();
  const searchBarInput = document.querySelector('#searchBarInput');

  if (searchBarInput.value) {
    searchedItems = await getSearchItems(searchBarInput.value);
  } else {
    // 검색어가 없을 경우
    initializeItems();
  }

  // 아이템 추가
  insertItemElement();
  searchBarInput.value = '';
}

// 검색된 아이템 가져오기
async function getSearchItems(value) {
  try {
    const result = await Api.get(`/api/item/search?query=${value}`);

    if (result.length === 0) {
      alert('검색된 상품이 없습니다.');
    }
    const resultToId = result.map(({ _id }) => _id);

    return resultToId;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
