import * as Api from '/api.js';

import { addCommas } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import { addSearchBarElement } from '../components/SearchBar/event.js';

// GET / api/item/?id= ...

const ITEMLIST = document.querySelector('.item-list');
const searchBarInput = document.querySelector('#searchBarInput');
// const searchBarBtn = document.querySelector('#searchBarBtn');

let items = []; // 빈 객체로 시작

await initializsItems(); // 처음엔 전체 목록
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
  addSearchBarElement();

  insertItemElement();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  document
    .querySelector('#searchBarBtn')
    .addEventListener('click', handleSearchBtn);
}
async function initializsItems() {
  items = await getAllItems();
}
async function insertItemElement() {
  // const response = await fetch(`/api/item`, {
  //   method: 'GET',
  //   headers: { 'Content-Type': 'application/json' },
  // });
  // const items = await response.json();
  console.log(items);
  ITEMLIST.innerHTML = '';
  items.forEach(({ _id, itemName, summary, imgUrl, price, deletedFlag }) => {
    console.log(_id);
    // isDeleted = true이면 deleted 클래스 넣기
    ITEMLIST.innerHTML += `
      <a href="/item/?id=${_id}" class="${deletedFlag ? 'deleted' : ''}">
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
  });
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
async function handleSearchBtn(e) {
  e.preventDefault();
  const searchBarInput = document.querySelector('#searchBarInput');

  // console.log(searchBarInput, searchBarInput.value);
  items = await getSearchItmes(searchBarInput.value);
  insertItemElement();
  searchBarInput.value();
}

async function getSearchItmes(value) {
  try {
    const result = await Api.get(`/api/item/search?query=${value}`);
    // const data = result.json();
    console.log(result);
    // console.log(data);
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
