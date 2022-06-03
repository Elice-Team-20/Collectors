import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';
import { checkAdmin } from '../../useful-functions.js';

window.onload = () => {
  // admin인지 확인하기
  if (!checkAdmin()) {
    alert('관리자 권한이 없습니다.');
    window.location.href = '/';
    return;
  }
};
const itemContainerDiv = document.querySelector('.item-container');
// 요소(element), input 혹은 상수
await addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  addFooterElements();
  await addItemListElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  addItemDelBtnEventListeners();
}
async function addItemListElements() {
  const itemList = await getItemList();
  itemContainerDiv.innerHTML = itemList.reduce(
    (text, { _id, itemName, imgUrl, category, price, stocks, deleteFlag }) => {
      return (
        text +
        `
          <div class="item ${deleteFlag ? 'deleted' : ''}" >
            <a href="/admin/manage/item/?id=${_id}" class="item-content-box">
              <div class="item-image-box">
                <img
                  id="itemImage"
                  src=${imgUrl}
                  alt="item-image"
                />
              </div>
              <div class="item-name">
                ${itemName}
              </div>
              <div class="item-category">${category}</div>
              <div class="stock">${addCommas(price)}원</div>
              <div class="stock">${addCommas(stocks)}개</div>
            </a>
            <button class="item-delete-btn" name="${_id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          `
      );
    },
    ``,
  );
}
async function getItemList() {
  try {
    const itemList = await Api.get('/api/item');
    return itemList;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

function addItemDelBtnEventListeners() {
  document.querySelectorAll('.item-delete-btn').forEach((node) => {
    node.addEventListener('click', handleItemDelBtn);
  });
}

async function handleItemDelBtn() {
  try {
    await Api.delete('/api/item/delete', this.name);
    alert('상품이 정상적으로 삭제 되었습니다.');
    window.location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
