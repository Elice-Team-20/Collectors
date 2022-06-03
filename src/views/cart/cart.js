import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  checkUserStatus,
  handleHamburger,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

const orderBtn = document.querySelector('#order-btn');
const cartItenWrapperDiv = document.querySelector('#cart-item-wrapper');
const shipFreeMinPrice = 50000;

let cart = cartInit(); //JSON.parse(localStorage.getItem('cart'));
console.log(cart);
let itemMap = makeCartItemMap(cart); // 카트 Map 만들기, id - 개수 구조
console.log(itemMap);
// let items = Object.entries(itemMap);
let checkedItems = makeCheckedItemMap(itemMap); // check된 상품들
let infos = await getCartItemsInfos(itemMap);
// let hasDeletedItems = false;
let deletedItems = [];
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
    if (item.deleteFlag) return map; // 삭제된 아이템 제외
    if (!map[item]) {
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

  // addOrderNavElements('Cart');

  addCartItemsElements();
  alertDeletedItems();
  addOrderInfoElement();
}

async function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  orderBtn.addEventListener('click', handleOrderBtn);

  addCartEventListeners();
}

// elements 추가 부분
function addCartItemsElements() {
  console.log(itemMap);
  deletedItems = [];
  cartItenWrapperDiv.innerHTML = Object.keys(itemMap).reduce((elements, id) => {
    console.log(infos[id]);
    if (!infos[id]) {
      deletedItems = [...deletedItems, id];
      return elements;
    }
    if (itemMap[id] != 0 && infos[id] != undefined) {
      const { imgUrl, itemName, price, deleteFlag } = infos[id];
      if (deleteFlag) return elements;
      let isOne = itemMap[id] === 1;
      return (
        elements +
        `
          <div class="cart-item ${deleteFlag ? 'deleted' : ''}" id="item-${id}">
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
              <button class="item-number-btn item-number-minus-btn" id="minBtn${id}"name="${id}" ${
          isOne ? 'disabled' : ''
        }>
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
  // 삭제된 아이템이 있을 경우
}
function alertDeletedItems() {
  // 삭제된 아이템이 있을 경우 확인 후 최초 한번 알림
  console.log(deletedItems);
  if (deletedItems.length !== 0) {
    console.log(deletedItems);
    cart = cart.filter((id) => !deletedItems.some((val) => val === id));
    console.log(cart);
    alert('장바구니에 있던 상품 중 품절된 것이 있습니다.');
  }
}
// DB에서 item 정보가져오기
async function getCartItemsInfos(itemMap) {
  let infos = {};
  let items = Object.entries(itemMap);
  try {
    for (let i = 0; i < items.length; i++) {
      const [_id, num] = items[i];
      const info = await Api.get(`/api/item/${_id}`);
      console.log(info);
      if (!info.deleteFlag) {
        infos[_id] = info; // 삭제된 아이템이 아닐 경우에만 넣기
      } else checkedItems[_id] = false;
    }
    return infos;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
function addOrderInfoElement() {
  // checketItems를 통해 선택된 거 체크
  // itemsMap 통해 개수 체크
  // infos를 통해 가격 체크
  let nums = 0;
  let totalPrice = 0;
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
  let shipFee = totalPrice > shipFreeMinPrice ? 0 : 3000;
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

// 주문하기 버튼
function handleOrderBtn() {
  if (checkUserStatus()) {
    let order = Object.keys(checkedItems).reduce((arr, id) => {
      console.log(checkedItems[id]);
      if (checkedItems[id]) {
        arr.push([id, itemMap[id]]);
      }
      return arr;
    }, []);
    if (order.length === 0) {
      return alert('주문할 상품이 없습니다. 상품 선택을 해주세요.');
    }
    console.log('order', order, 'cart', cart);
    localStorage.setItem('cart', JSON.stringify(cart)); // 삭제된 아이템 삭제
    localStorage.setItem('order', JSON.stringify(order));
    window.location.href = '/order';
  } else {
    alert('로그인 정보가 없습니다. 로그인 후에 주문이 가능합니다.');
    window.location.href = '/login';
  }
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
function checkStock() {}
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
  if (itemMap[this.name] > 1) {
    cart.splice(
      cart.findIndex((val) => val === this.name),
      1,
    );
    localStorage.setItem('cart', JSON.stringify(cart));
    itemMap[this.name] -= 1;
    addCartItemsElements();
    addCartEventListeners();
    addOrderInfoElement();
    if (itemMap[this.name] === 1) {
      const btn = document.querySelector(`#minBtn${this.name}`);
      console.log('this', this, btn);
      btn.disabled = true;
    }
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
