import {
  addNavEventListeners,
  addNavElements,
} from "../components/Nav/event.js";
import { addFooterElements } from "../components/Footer/event.js";
import {
  addOrderNavElements,
  addOrderInfoElements,
} from "../components/Order/event.js";

const orderBtn = document.querySelector("#order-btn");

addAllElements();
addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();

  addOrderNavElements("Cart");
  // addOrderInfoElements("Cart");

  addCartItemsElement();
}

function addAllEvents() {
  addNavEventListeners();
  orderBtn.addEventListener("click", orderBtnHandler);
}

function orderBtnHandler() {
  window.location.href = "/order";
}

async function addCartItemsElement() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  console.log(cart);
  // 카트 Map 만들기, id - 개수 구조
  let items = makeCartItemMap(cart);
  console.log(items);
  console.log(Object.entries(items));
  // 카트 item 정보 DB에서 가져오기
  let infos = await getCartItemsInfos(items);
  console.log(infos);
}
// 구매하기 버튼 처리
// 로컬 스토리지에서 데이터 가져오기
function makeCartItemMap(cart) {
  return cart.reduce((map, item) => {
    console.log(item, map[item]);
    if (!map[item]) {
      console.log("map init", item);
      map[item] = 0;
    }
    map[item] += 1;
    return map;
  }, {});
}
// DB에서 item 정보가져오기
async function getCartItemsInfos(items) {
  const itemArr = Object.entries(items);
  console.log(itemArr);
  let infos = [];
  for (let i = 0; i < itemArr.length; i++) {
    console.log(i);
    const [_id, num] = itemArr[i];
    console.log(i, itemArr[i]);
    const response = await fetch(`/api/item/${_id}`);
    const info = await response.json();
    infos.push(info);
  }
  console.log(infos);
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
