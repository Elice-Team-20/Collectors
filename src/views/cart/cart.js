import { addCommas } from '/useful-functions.js';
import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import {
  addOrderNavElements,
  addOrderInfoElements,
} from '../components/Order/event.js';

const orderBtn = document.querySelector('#order-btn');
const cartItenWrapperDiv = document.querySelector('#cart-item-wrapper');

let cart = JSON.parse(localStorage.getItem('cart'));
let itemMap = makeCartItemMap(cart); // 카트 Map 만들기, id - 개수 구조
let items = Object.entries(itemMap);
let checkedItems = makeCheckedItemMap(itemMap); // check된 상품들
console.log(checkedItems);

// const itemArr = Object.entries(items);
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();

  addOrderNavElements('Cart');
  // addOrderInfoElements("Cart");

  await addCartItemsElements(items);
}

async function addAllEvents() {
  addNavEventListeners();
  orderBtn.addEventListener('click', orderBtnHandler);

  addCartEventListeners(items);
}

function orderBtnHandler() {
  window.location.href = '/order';
}

function addCartEventListeners(items) {
  console.log(items);
  // 전체 선택 체크 박스 이벤트 처리
  document
    .querySelector('#allSelectCheckbox')
    .addEventListener('click', handleAllCheckbox);
  // 각 아이템 별 체크 박스, 수량 조절 버튼 이벤트 처리
  document.querySelectorAll('.item-select-checkbox').forEach((node) => {
    node.addEventListener('click', handleItemCheckbox);
  });
  document.querySelectorAll('.item-number-plus-btn').forEach((node) => {
    node.addEventListener('click', handleNumberPlusBtn);
  });
  document.querySelectorAll('.item-number-minus-btn').forEach((node) => {
    node.addEventListener('click', handleNumberMinusBtn);
  });
  // items.forEach(([_id, num]) => {
  //   console.log(_id, num);
  //   // document
  //   //   .querySelector(`#checkbox-${_id}`)
  //   //   .addEventListener("click", handleItemCheckbox);
  //   const item = document.querySelector(`#item-${_id}`);
  //   console.log(item);
  //   item
  //     .querySelector('.item-select-checkbox')
  //     .addEventListener('click', handleItemCheckbox);
  //   item
  //     .querySelector('.item-number-plus-btn')
  //     .addEventListener('click', handleNumberPlusBtn);
  //   item
  //     .querySelector('.item-number-minus-btn')
  //     .addEventListener('click', handleNumberMinusBtn);
  // });
}
function handleAllCheckbox(e) {
  console.log(this.checked);
  const itemCheckBox = document.querySelectorAll('.item-select-checkbox');
  console.log(itemCheckBox);
  if (this.checked) {
    Object.keys(checkedItems).forEach((id) => {
      checkedItems[id] = true;
    });
    itemCheckBox.forEach((node) => {
      node.checked = true;
    });
  } else {
    Object.keys(checkedItems).forEach((id) => {
      checkedItems[id] = false;
    });
    itemCheckBox.forEach((node) => {
      node.checked = false;
    });
  }
}
function handleItemCheckbox(e) {
  console.log('check', this.checked);
  console.log('check', this.name);
  if (this.checked) {
    checkedItems[this.name] = true;
  } else {
    checkedItems[this.name] = false;
  }
  console.log(checkedItems);
  // 전체 선택 체크박스 관리
  document.querySelector('#allSelectCheckbox').checked = Object.values(
    checkedItems,
  ).every((value) => value === true);
}
function handleNumberPlusBtn(e) {
  console.log('plus', this.name);
  console.log('plus', e);
}
function handleNumberMinusBtn(e) {
  console.log('Min', this.name);
  console.log('Min', e);
}
async function addCartItemsElements(items) {
  let infos = await getCartItemsInfos(items);
  // console.log(infos);
  cartItenWrapperDiv.innerHTML = infos.reduce(
    (elements, { imgUrl, itemName, num, price, _id }) => {
      return (
        elements +
        `
      <div class="cart-item" id="item-${_id}">
        <input type="checkbox" class="item-select-checkbox" name="${_id}" checked/>
        <div class="item-image-box">
          <img
            class="item-image"
            src="${imgUrl}"
            alt="item-image"
          />
        </div>
        <div class="item-name"><a href="/item/?id=${_id}">${itemName}</a></div>
        <div class="item-price">${addCommas(price)}원</div>
        <div class="item-number-box">
          <button class="item-number-btn item-number-plus-btn" name="${_id}">
            <i class="fa-solid fa-circle-plus"></i>
          </button>
          <div>${num}</div>
          <button class="item-number-btn item-number-minus-btn" name="${_id}">
            <i class="fa-solid fa-circle-minus"></i>
          </button>
        </div>
        <div class="item-total-price">${addCommas(num * price)}원</div>
      </div>
    `
      );
    },
    ``,
  );
}
// 구매하기 버튼 처리
// 로컬 스토리지에서 데이터 가져오기
function makeCartItemMap(cart) {
  return cart.reduce((map, item) => {
    // console.log(item, map[item]);
    if (!map[item]) {
      // console.log("map init", item);
      map[item] = 0;
    }
    map[item] += 1;
    return map;
  }, {});
}
function makeCheckedItemMap(map) {
  return Object.keys(map).reduce((map, id) => {
    map[id] = true;
    return map;
  }, {});
}
// DB에서 item 정보가져오기
async function getCartItemsInfos(items) {
  // console.log(itemArr);
  let infos = [];
  for (let i = 0; i < items.length; i++) {
    // console.log(i);
    const [_id, num] = items[i];
    // console.log(i, itemArr[i]);
    const response = await fetch(`/api/item/${_id}`);
    let info = await response.json();
    info = {
      ...info,
      num,
    };
    infos.push(info);
  }
  // console.log(infos);
  return infos;
  // 프로미스가 반환되는데 다른 방법이 있을까요?
  // return Object.entries(items).map(async ([_id, num]) => {
  //   console.log(_id, num);
  //   try {
  //     const response = await fetch(`/api/item/${_id}`);
  //     const info = await response.json();
  //     // const info = await getCartItemInfo(_id);
  //     console.log(info);
  //     info[num] = num;
  //     // map[_id] = info;
  //     // return [info, ...map];
  //     return info;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });
}
