// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { addCommas } from "/useful-functions.js";

import {
  addNavEventListeners,
  addNavElements,
} from "../../components/Nav/event.js";
import { addFooterElements } from "../../components/Footer/event.js";

// url에서 id 값 추출해오기
const ITEMDETAIL = document.querySelector(".item-detail");
const queryString = window.location.search;
const id = new URLSearchParams(queryString).get("id");

// navigation, footer 컴포넌트 넣기
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();

  await insertItemDetail(id);
}

async function addAllEvents() {
  addNavEventListeners();
  document
    .querySelector("#addCartBtn")
    .addEventListener("click", addCartBtnHandler);
}

// 카트 추가
function addCartBtnHandler() {
  let currentCart = JSON.parse(localStorage.getItem("cart"));
  if (!currentCart) currentCart = [];
  currentCart.push(id);
  console.log("add cart", currentCart);
  localStorage.setItem("cart", JSON.stringify(currentCart));
}

// 상세 페이지 렌더링 함수
async function insertItemDetail(id) {
  const response = await fetch(`/api/item/${id}`);
  const details = await response.json();
  console.log(details);
  const {
    itemName,
    category,
    manufacturingCompany,
    summary,
    mainExplanation,
    imgUrl,
    stocks,
    price,
    hashTag,
  } = details;
  console.log(imgUrl);
  ITEMDETAIL.insertAdjacentHTML(
    "beforeend",
    `
      <div class="item">
        <div class="item-left">
          <img src="${imgUrl}" alt="item-image" />
        </div>
        <div class="item-right">
          <div class="item-description-box">
            <div id="item-name">
              ${itemName}
            </div>
            <div class="seperator"></div>
            <div class="item-contents">
              <div id="item-company">${manufacturingCompany}</div>
              <div id="item-price">${addCommas(price)}</div>
              <div id="item-explanation">${mainExplanation}</div>
            </div>
          </div>
          <div class="item-buttons-box">
            <button id="addCartBtn">장바구니 추가하기</button>
            <button id="buyNowBtn">바로 구매하기</button>
          </div>
      </div>
    `
  );
}
