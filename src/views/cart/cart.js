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

function addAllElements() {
  addNavElements();
  addFooterElements();

  addOrderNavElements("Cart");
  addOrderInfoElements("Cart");
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  orderBtn.addEventListener("click", orderBtnHandler);
}

function orderBtnHandler() {
  window.location.href = "/order";
}

// 구매하기 버튼 처리
// 로컬 스토리지에서 데이터 가져오기
