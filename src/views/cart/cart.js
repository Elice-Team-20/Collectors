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
import { OrderInfo } from '../components/Order/index.js';

const orderBtn = document.querySelector('#order-btn');
const cartItenWrapperDiv = document.querySelector('#cart-item-wrapper');

let cart = cartInit(); //JSON.parse(localStorage.getItem('cart'));
let itemMap = makeCartItemMap(cart); // 카트 Map 만들기, id - 개수 구조
// let items = Object.entries(itemMap);
let checkedItems = makeCheckedItemMap(itemMap); // check된 상품들
let infos = await getCartItemsInfos(Object.entries(itemMap));
console.log(checkedItems);

// 카트 아이템들 자료구조
// 카트 init
function cartInit() {
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify([]));
  }
  return cart;
}
// 카트 아이템 관리 map
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
// 선택 아이템 관리 map
function makeCheckedItemMap(map) {
  return Object.keys(map).reduce((map, id) => {
    map[id] = true;
    return map;
  }, {});
}
// 전체 엘리먼트, 이벤트 처리 함수
await addAllElements();
await addAllEvents();

function addAllElements() {
  addNavElements();
  addFooterElements();

  addOrderNavElements('Cart');
  // addOrderInfoElements("Cart");

  addCartItemsElements();
  addOrderInfoElement();
}

async function addAllEvents() {
  addNavEventListeners();
  orderBtn.addEventListener('click', orderBtnHandler);

  addCartEventListeners();
}

// elements 추가 부분
function addCartItemsElements() {
  // let items = Object.entries(itemMap);
  // infos =  // 전역 변수에 저장/
  // console.log(infos);
  cartItenWrapperDiv.innerHTML = Object.keys(itemMap).reduce((elements, id) => {
    if (itemMap[id] != 0) {
      const { imgUrl, itemName, price } = infos[id];
      console.log('addItem checkbox', checkedItems[id]);
      return (
        elements +
        `
          <div class="cart-item" id="item-${id}">
            <input type="checkbox" class="item-select-checkbox" name="${id}" ${
          checkedItems[id] ? 'checked' : ''
        }/>
            <div class="item-image-box">
              <img
                class="item-image"
                src="${imgUrl}"
                alt="item-image"
              />
            </div>
            <div class="item-name"><a href="/item/?id=${id}">${itemName}</a></div>
            <div class="item-price">${addCommas(price)}원</div>
            <div class="item-number-box">
              <button class="item-number-btn item-number-minus-btn" name="${id}">
                <i class="fa-solid fa-circle-minus"></i>
              </button>
              <div>${itemMap[id]}</div>
              <button class="item-number-btn item-number-plus-btn" name="${id}">
                <i class="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <div class="item-total-price">${addCommas(
              itemMap[id] * price,
            )}원</div>
            <button class="item-delete-btn" name="${id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        `
      );
    } else {
      return elements;
    }
  }, ``);
}

// DB에서 item 정보가져오기
async function getCartItemsInfos(items) {
  let infos = {};
  for (let i = 0; i < items.length; i++) {
    const [_id, num] = items[i];
    const response = await fetch(`/api/item/${_id}`);
    let info = await response.json();
    // info = {
    //   ...info,
    //   num,
    // };
    infos[_id] = info;
  }
  return infos;
}
function addOrderInfoElement() {
  // checketItems를 통해 선택된 거 체크
  // itemsMap 통해 개수 체크
  // infos를 통해 가격 체크
  let nums = 0;
  let totalPrice = 0;
  let shipFee = 3000;
  console.log(infos);
  Object.entries(checkedItems).forEach(([id, checked]) => {
    if (checked) {
      const num = itemMap[id];
      const { price } = infos[id];
      console.log('order card', id, num, price);
      nums += Number(num);
      totalPrice += Number(price * num);
    }
  });
  // let orderInfoDiv = document.querySelector('.order-info');
  document.querySelector('.order-info').innerHTML = `
    <div class="data">
      <p>상품 수</p>
      <p id="item-number">${nums}개</p>
    </div>
    <div class="data">
      <p>상품 금액</p>
      <p id="item-price">${addCommas(totalPrice)}원</p>
    </div>
    <div class="data">
      <p>배송비</p>
      <p id="shipping">${addCommas(shipFee)}원</p>
    </div>  
  `;
  document.querySelector('.total').innerHTML = `
    <p>총 결제 금액</p>
    <p id="total">${addCommas(totalPrice + shipFee)}원</p>
  `;
}

// event 처리 부분
function orderBtnHandler() {
  let order = Object.keys(checkedItems).filter((id) => checkedItems[id]);
  console.log('order', order);
  localStorage.setItem('order', JSON.stringify(order));
  window.location.href = '/order';
}

function addCartEventListeners() {
  // console.log(items);
  // 전체 선택 체크 박스 이벤트 처리
  document
    .querySelector('#allSelectCheckbox')
    .addEventListener('click', handleAllCheckbox);
  // 전체 삭제 버튼 이벤트 처리
  document
    .querySelector('#delete-all-btn')
    .addEventListener('click', handleDeleteAllBtn);
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
  document.querySelectorAll('.item-delete-btn').forEach((node) => {
    node.addEventListener('click', handleDeleteItemBtn);
  });
}
function handleAllCheckbox(e) {
  console.log(this.checked);
  console.log('cheklist', checkedItems);
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
  addOrderInfoElement();
}
function handleDeleteAllBtn() {
  console.log('cart', cart);
  if (cart.length !== 0) {
    Object.keys(checkedItems).forEach((id) => {
      if (checkedItems[id]) {
        itemMap[id] = 0;
        cart = cart.filter((cartId) => cartId !== id);
      }
    });
    console.log('after', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    addCartItemsElements();
    addCartEventListeners();
    addOrderInfoElement();
  } else {
    alert('장바구니에 삭제할 아이템이 없습니다.');
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
  addOrderInfoElement();
}
function handleNumberPlusBtn(e) {
  console.log('plus', this.name);
  console.log('plus', e);
  console.log('cur', cart);
  cart.push(this.name);
  localStorage.setItem('cart', JSON.stringify(cart));
  itemMap[this.name] += 1;
  // window.location.reload();
  addCartItemsElements();
  addCartEventListeners();
  addOrderInfoElement();
}
function handleNumberMinusBtn(e) {
  console.log('Min', this.name);
  console.log('Min', e);
  console.log('cur', cart);
  if (itemMap[this.name] > 1) {
    cart.splice(
      cart.findIndex((val) => val === this.name),
      1,
    );
    // console.log(cart.findIndex((val) => val === this.name));
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('after', cart);
    itemMap[this.name] -= 1;
    // window.location.reload();
    addCartItemsElements();
    addCartEventListeners();
    addOrderInfoElement();
  } else {
    alert('수량이 하나 남았습니다. 삭제를 원하면 삭제 버튼을 이용해주세요.');
  }
}

function handleDeleteItemBtn(e) {
  console.log('delete');
  cart = cart.filter((id) => id !== this.name);
  console.log(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('after', cart);
  itemMap[this.name] = 0;
  addCartItemsElements();
  addCartEventListeners();
  addOrderInfoElement();
}
