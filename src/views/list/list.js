import * as Api from '/api.js';

import { addCommas, selectElement } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';

import { addFooterElements } from '../components/Footer/event.js';
import {
  addCategoryMenuElement,
  addCategoryMenuEventListeners,
} from '../components/Category/event.js';
import {
  addQuickMenuElement,
  addQuickMenuEventListeners,
} from '../components/QuickMenu/event.js';
import { addSearchBarElement } from '../components/SearchBar/event.js';

// GET / api/item/?id= ...

const itemList = selectElement('.item-list');
const categorySection = selectElement('#category');
const quickMenu = selectElement('#quick-menu');
const queryString = window.location.search;
const category = new URLSearchParams(queryString).get('category');

let items = []; // 전체 or 카테고리 아이템 담을 객체
let searchedItems = []; // 검색된 거 담을 객체

await initializsItems(); // 처음엔 전체 목록
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
  addCategoryMenuElement(categorySection);
  addQuickMenuElement(quickMenu);
  addSearchBarElement();
  insertItemElement();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  addCategoryMenuEventListeners();
  addQuickMenuEventListeners(quickMenu);
  document
    .querySelector('#searchBarBtn')
    .addEventListener('click', handleSearchBtn);
}
async function initializsItems() {
  console.log(category);
  if (!category) items = await getAllItems();
  else items = await getCategoryItems();
  console.log('init', items);
}
async function insertItemElement() {
  let filteredItems = items;
  if (searchedItems.length !== 0) {
    filteredItems = items.filter(({ _id }) => {
      return searchedItems.some((val) => val === _id);
    });
  }
  searchedItems = []; // 빈객체로 초기화
  itemList.innerHTML = '';
  filteredItems.forEach(
    ({ _id, itemName, summary, imgUrl, price, deleteFlag }) => {
      // isDeleted = true이면 deleted 클래스 넣기
      if (deleteFlag) return;
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
              <h1 id="itemName">${itemName}</h1>
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

async function getAllItems() {
  try {
    const result = await Api.get(`/api/item`);
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function getCategoryItems() {
  try {
    const result = await Api.get(`/api/item/category/${category}`);
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function handleSearchBtn(e) {
  e.preventDefault();
  const searchBarInput = document.querySelector('#searchBarInput');

  if (searchBarInput.value) {
    searchedItems = await getSearchItmes(searchBarInput.value);
  } else {
    // 검색창에 아무것도 없으면
    initializsItems();
  }
  insertItemElement();
  searchBarInput.value = '';
}

async function getSearchItmes(value) {
  try {
    const result = await Api.get(`/api/item/search?query=${value}`);
    // const data = result.json();
    console.log(result);
    if (result.length === 0) {
      alert('검색된 상품이 없습니다.');
    }
    // console.log(data);
    const resultToId = result.map(({ _id }) => _id);
    return resultToId;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
