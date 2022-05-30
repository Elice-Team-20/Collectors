import * as Api from '/api.js';

import { addCommas } from '/useful-functions.js';
import {
  addNavEventListeners,
  addNavElements,
} from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import { addOrderNavElements } from '../components/Order/event.js';

const orderList = JSON.parse(localStorage.getItem('order'));
let orderInfo = { orderList };
const shipFreeMinPrice = 50000;
console.log(orderList);

const purchaseBtn = document.querySelector('#purchase-btn');
const findAddressBtn = document.querySelector('#findAddressBtn');

// 배송지 정보 폼
const nameInput = document.querySelector('#name');
const phoneNumberInput = document.querySelector('#phoneNumber');
const postNumberInput = document.querySelector('#postNumber');
const address1Input = document.querySelector('#address1');
const address2Input = document.querySelector('#address2');

addAllElements();
addAllEvents();

function addAllElements() {
  addNavElements();
  addFooterElements();
  addOrderNavElements('Order');
  addOrderInfoElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  addNavEventListeners();
  purchaseBtn.addEventListener('click', purchaseBtnHandler);
  findAddressBtn.addEventListener('click', handleFindAddressBtn);
}
async function purchaseBtnHandler() {
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
  // else {
  //   // 정상
  //   sendOrderInfo();
  //   // window.location.href = '/order/complete';
  // }
  console.log(orderInfo);
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
  };
  console.log(addressData);
  console.log(shipData);
  // const response = await fetch(`/api/order`,{
  //   method:'POST',

  // })
  try {
    const user_id = await Api.get('/api/user/id');
    console.log(user_id);
    await Api.post('/api/order', shipData);
    await Api.patch(`/api/user/users/${user_id}/address`, {
      address: addressData,
    });

    alert(`정상적으로 주문이 완료되었습니다.`);

    // 로그인 페이지 이동
    // window.location.href = '/login';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
async function sendOrderInfo() {}
function handleFindAddressBtn() {
  new daum.Postcode({
    oncomplete: function (data) {
      //data는 사용자가 선택한 주소 정보를 담고 있는 객체이며, 상세 설명은 아래 목록에서 확인하실 수 있습니다.
      console.log(data);
      postNumberInput.value = data.zonecode;
      address1Input.value = data.address;
      // 이때 readonly를 해제하고 싶은데 안된다..
    },
  }).open();
}

async function addOrderInfoElements() {
  const orderItemsDiv = document.querySelector('#orderItems');
  const itemTotalPriceDiv = document.querySelector('#itemTotalPrice');
  const shipFeeDiv = document.querySelector('#shipFee');
  const totalPriceDiv = document.querySelector('#totalPrice');

  const { orderItemsText, totalItemPrice, shipFee } = await getOrderItemInfos();
  console.log(orderItemsText);
  orderItemsDiv.innerHTML = orderItemsText;
  itemTotalPriceDiv.innerHTML = addCommas(totalItemPrice);
  shipFeeDiv.innerHTML = addCommas(shipFee);
  totalPriceDiv.innerHTML = addCommas(totalItemPrice + shipFee);
}

async function getOrderItemInfos() {
  let orderItemsText = ``;
  let totalItemPrice = 0;
  for (let i = 0; i < orderList.length; i++) {
    const [id, num] = orderList[i];
    console.log(id, num);
    const response = await fetch(`/api/item/${id}`);
    const info = await response.json();
    console.log(info);
    const { itemName, price } = info;
    orderItemsText += `<div>${itemName} / ${num}개</div>`;
    totalItemPrice += Number(price) * num;
  }

  let shipFee = totalItemPrice > shipFreeMinPrice ? 0 : 3000;
  orderInfo = {
    totalCost: totalItemPrice + shipFee,
  };
  return { orderItemsText, totalItemPrice, shipFee };
}
