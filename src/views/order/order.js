import * as Api from '/api.js';

import { addCommas } from '/useful-functions.js';
import {
  addNavEventListeners,
  addNavElements,
  checkUserStatus,
  handleHamburger,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';

const orderList = JSON.parse(localStorage.getItem('order'));
const isLoggedIn = checkUserStatus();
window.onload = async () => {
  if (!orderList) {
    alert('주문 정보가 없습니다. 주문 정보를 확인해주세요.');
    window.location.href = '/cart';
    return;
  }
  if (!isLoggedIn) {
    alert('비정상적인 접근입니다.');
    window.location.href = '/';
    return;
  }
};

let orderInfo = { orderList };
const shipFreeMinPrice = 50000;

const purchaseBtn = document.querySelector('#purchase-btn');
const findAddressBtn = document.querySelector('#findAddressBtn');

// 배송지 정보 폼
const nameInput = document.querySelector('#name');
const phoneNumberInput = document.querySelector('#phoneNumber');
const postNumberInput = document.querySelector('#postNumber');
const address1Input = document.querySelector('#address1');
const address2Input = document.querySelector('#address2');
const requestMsgInput = document.querySelector('#requestMsgInput');
const requestMsgTextInputDiv = document.querySelector(
  '#requestMsgTextInputDiv',
);

let shipRequest = ``;

await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
  if (isLoggedIn) await addUserShipElements(); // 유저 배송지 정보 가져오기
  await addOrderInfoElements(); // 주문 정보 가져오기
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  await addInputEventListener();
}
async function addInputEventListener() {
  await purchaseBtn.addEventListener('click', handlePurchaseBtn);
  await findAddressBtn.addEventListener('click', handleFindAddressBtn);
  await requestMsgInput.addEventListener('change', handleRequestMsgInput);
}
function handleRequestMsgInput() {
  // 요청 사항 핸들러
  if (this.selectedIndex === 0) {
    shipRequest = '';
    requestMsgTextInputDiv.innerHTML = '';
  } else if (this.selectedIndex === this.options.length - 1) {
    requestMsgTextInputDiv.innerHTML = `<input class="input" id="requestMsgText" type="text"/>`;
  } else {
    shipRequest = this.options[this.selectedIndex].text;
    requestMsgTextInputDiv.innerHTML = '';
  }
}
async function handlePurchaseBtn() {
  // 주문 내역 전송.
  if (!nameInput.value) {
    return alert('주문자 이름을 적어주세요.');
  }
  if (!phoneNumberInput.value) {
    return alert('주문자 전화번호를 적어주세요.');
  }
  if (!postNumberInput.value || !address1Input.value) {
    return alert('주소를 입력해주세요.');
  }
  if (!address2Input.value) {
    return alert('상세 주소를 입력해주세요.');
  }
  if (!orderInfo.totalCost || !orderList) {
    window.location.href = '/cart';
    return alert('결제 정보를 다시 확인해주세요.');
  }
  if (requestMsgInput.selectedIndex === requestMsgInput.options.length - 1) {
    // 요청 사항 직접 입력하기 처리
    shipRequest = document.querySelector('#requestMsgText').value;
  }
  const itemList = orderList.map(([id, num]) => {
    return { itemId: id, count: num };
  });
  const addressData = {
    postalCode: postNumberInput.value,
    address1: address1Input.value,
    address2: address2Input.value,
  };
  const shipData = {
    shipAddress: addressData,
    totalCost: orderInfo.totalCost,
    recipientName: nameInput.value,
    recipientPhone: phoneNumberInput.value,
    shipRequest,
    itemList,
  };
  try {
    const user_id = await Api.get('/api/user/id');
    const orderData = {
      userId: user_id,
      orderInfo: shipData,
    };
    await Api.post('/api/order/makeOrder', orderData);

    localStorage.removeItem('order');
    localStorage.setItem('orderInfo', JSON.stringify(orderInfo));

    alert(`정상적으로 주문이 완료되었습니다.`);

    // 주문 완료 페이지 이동
    window.location.href = '/order/complete';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

function handleFindAddressBtn() {
  new daum.Postcode({
    oncomplete: function (data) {
      postNumberInput.value = data.zonecode;
      address1Input.value = data.address;
      address2Input.value = '';
    },
  }).open();
}
async function addUserShipElements() {
  const { fullName, address, phoneNumber } = await getUserShipInfos();
  if (fullName) nameInput.value = fullName;
  if (phoneNumber) phoneNumberInput.value = phoneNumber;
  if (address) {
    postNumberInput.value = address.postalCode;
    address1Input.value = address.address1;
    address2Input.value = address.address2;
  }
}
async function getUserShipInfos() {
  try {
    const user_id = await Api.get('/api/user/id');
    const userInfo = await Api.get(`/api/user/${user_id}`);
    return userInfo;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function addOrderInfoElements() {
  const orderItemsDiv = document.querySelector('#orderItems');
  const itemTotalPriceDiv = document.querySelector('#itemTotalPrice');
  const shipFeeDiv = document.querySelector('#shipFee');
  const totalPriceDiv = document.querySelector('#totalPrice');

  const { orderItemsText, totalItemPrice, shipFee } = await getOrderItemInfos();

  orderItemsDiv.innerHTML = orderItemsText;
  itemTotalPriceDiv.innerHTML = `${addCommas(totalItemPrice)}원`;
  shipFeeDiv.innerHTML = `${addCommas(shipFee)}원`;
  totalPriceDiv.innerHTML = `${addCommas(totalItemPrice + shipFee)}원`;
}

async function getOrderItemInfos() {
  let orderItemsText = ``;
  let totalItemPrice = 0;
  try {
    for (let i = 0; i < orderList.length; i++) {
      const [id, num] = orderList[i];
      const info = await Api.get(`/api/item/${id}`);
      // const info = await response.json();
      const { itemName, price } = info;
      orderItemsText += `<div>${itemName} / ${num}개</div>`;
      totalItemPrice += Number(price) * num;
    }

    let shipFee = totalItemPrice > shipFreeMinPrice ? 0 : 3000;
    orderInfo = {
      totalCost: totalItemPrice + shipFee,
      orderItemsText,
    };
    return { orderItemsText, totalItemPrice, shipFee };
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
window.onunload = () => {
  localStorage.removeItem('order');
};
