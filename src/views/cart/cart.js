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

let cart = cartInit(); // cart token 가져오기
const isLoggedIn = checkUserStatus();
let userRole = await userInit(); // 사용자 티어 가져오기
console.log(userRole);
let itemMap = makeCartItemMap(cart); // 카트 Map 만들기, id - 개수 구조
let checkedItems = makeCheckedItemMap(itemMap); // check된 상품들
let infos = await getCartItemsInfos(itemMap);
let deletedItems = []; // 삭제해야 할 상품 id 값 배열
let avaiableStocksMap = {}; // 상품 id : 실제 수량
let changedOrderNumber = false; // 실제 수량에 맞춰 카트 수량 변경 여부
const discountRateMap = {
  '호크 아이': (100 - 0) / 100,
  '피터 파커': (100 - 3) / 100,
  '닥터 스트레인지': (100 - 5) / 100,
  '토니 스타크': (100 - 15) / 100,
  '블랙 팬서': (100 - 30) / 100,
};
let finalOrderPrice = 0;
let originalPrice = 0;

function cartInit() {
  // cart token 가져오기
  let cart = JSON.parse(localStorage.getItem('cart'));
  if (!cart) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify([]));
  }
  return cart;
}
async function userInit() {
  if (!isLoggedIn) {
    // 로그인 정보가 없다면
    alert(
      '당신은 호크 아이(비회원)입니다. 가입하시면 할인을 받을 수 있습니다.',
    );
    return '호크 아이';
  }
  try {
    const result = await Api.get('/api/user/role');
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
function makeCartItemMap(cart) {
  // 카트 아이템 관리 map
  return cart.reduce((map, item) => {
    if (item.deleteFlag) return map; // 삭제된 아이템 제외
    if (!map[item]) {
      map[item] = 0;
    }
    map[item] += 1;
    return map;
  }, {});
}
function makeCheckedItemMap(map) {
  // 선택 아이템 관리 map
  return Object.keys(map).reduce((map, id) => {
    map[id] = true;
    return map;
  }, {});
}

await addAllElements();
await addAllEvents();

function addAllElements() {
  addNavElements();
  addFooterElements();

  addCartItemsElements();
  alertDeletedItems();
  if (changedOrderNumber) alertStockNotAvailable();
  addOrderInfoElement();
}

async function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  orderBtn.addEventListener('click', handleOrderBtn);

  addCartEventListeners();
}
function alertStockNotAvailable() {
  alert('상품 중 수량이 부족한 것이 있어 조절하였습니다.');
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
      const { imgUrl, itemName, price, deleteFlag, stocks } = infos[id];
      if (deleteFlag) return elements;
      // 수량 체크 후 가능한 수량 개수만 이용
      avaiableStocksMap[id] = stocks; // 최대 수량 저장
      let finalStock = stocks > itemMap[id] ? itemMap[id] : stocks; // 표시할 수량
      if (0 < finalStock < itemMap[id]) {
        // 선택한 수량이 재고보다 많을 경우
        changedOrderNumber = true;
      }
      if (finalStock === 0) {
        // 구매 가능한 수량이 없다면
        checkedItems[id] = false; // 체크 해제
        deletedItems = [...deletedItems, id]; // 장바구니에서 구매 불가한 것 제외. api 처리가 필요해보임.
      }
      let isLimit = finalStock === avaiableStocksMap[id];
      if (isLimit) {
        let count = 0;
        let until = itemMap[id] - avaiableStocksMap[id];
        console.log('until', until);
        cart.filter((val) => {
          if (count < until && val === id) {
            count += 1;
            return false;
          }
          return true;
        });
        console.log(cart);
        itemMap[id] = finalStock;
      }
      let isOne = itemMap[id] === 1; // 현재 최고 수량이라면 disabled 하기 위함
      console.log(itemName, itemMap[id], avaiableStocksMap[id]);
      console.log();
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
              <button class="item-number-btn item-number-plus-btn" name="${id}"${
          isLimit ? 'disabled' : ''
        }>
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
  let shipFee =
    totalPrice * discountRateMap[userRole] > shipFreeMinPrice ? 0 : 3000;
  document.querySelector('.order-info').innerHTML = `
    <div class="data">
      <p>상품 수</p>
      <p id="item-number">${nums}개</p>
    </div>
    <div class="data">
      <p>상품 금액</p>
      <p ${isLoggedIn ? 'id=originPrice' : ''}>${addCommas(totalPrice)}원</p>
    </div>
    ${
      isLoggedIn
        ? `
        <div class="data" id="discountPrice">
          <p>할인된 금액</p>
          <p id="item-price">${addCommas(
            totalPrice * discountRateMap[userRole],
          )}원</p>
        </div>
      `
        : ``
    }
    <div class="data">
      <p>배송비</p>
      <p id="shipping">${addCommas(shipFee)}원</p>
    </div>  
  `;
  document.querySelector('.total').innerHTML = `
    <p>총 결제 금액</p>
    <p id="total">${addCommas(
      totalPrice * discountRateMap[userRole] + shipFee,
    )}원</p>
  `;
  originalPrice = totalPrice;
  finalOrderPrice = totalPrice * discountRateMap[userRole];
}

// 주문하기 버튼
function handleOrderBtn() {
  if (isLoggedIn) {
    let list = Object.keys(checkedItems).reduce((arr, id) => {
      console.log(checkedItems[id]);
      if (checkedItems[id]) {
        arr.push([id, itemMap[id], infos[id].itemName]);
      }
      return arr;
    }, []);
    if (list.length === 0) {
      alert('주문할 상품이 없습니다. 상품 선택을 해주세요.');
      window.location.href = '/items';
      return;
    }
    console.log('order', list, 'cart', cart);
    const data = {
      list,
      originalPrice,
      finalOrderPrice,
    };
    localStorage.setItem('orderData', JSON.stringify(data)); // 주문
    window.location.href = '/order';
  } else {
    alert('로그인 정보가 없습니다. 로그인 후에 주문이 가능합니다.');
    window.location.href = '/login';
  }
}

function addCartEventListeners() {
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
  // 수량 늘리기 버튼
  cart.push(this.name);
  localStorage.setItem('cart', JSON.stringify(cart));
  itemMap[this.name] += 1;
  addCartItemsElements();
  addCartEventListeners();
  addOrderInfoElement();
  if (itemMap[this.name] === avaiableStocksMap[this.name]) {
    // 구매 가능 수량 이상으로 전환 불가
    const btn = document.querySelector(`#plusBtn${this.name}`);
    btn.disabled = true;
  }
}
function handleNumberMinusBtn(e) {
  // 수량 줄이기 버튼
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
      // 1이하로 불가
      const btn = document.querySelector(`#minBtn${this.name}`);
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

window.onunload = () => {
  // 삭제된 아이템 카트에서 제외
  localStorage.setItem('cart', JSON.stringify(cart));
};
