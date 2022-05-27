import { OrderInfo, OrderNav } from "./index.js"; // 장바구니, 주문 결제 컴포넌트

const cartWrap = document.querySelector(".cart-wrap");
const infoWrap = document.querySelector(".order-info");

const addOrderNavElements = (page) => {
  cartWrap.insertAdjacentHTML("afterbegin", OrderNav(page));
};

const addOrderInfoElements = (page) => {
  infoWrap.insertAdjacentHTML("afterend", OrderInfo(page));
};

export { addOrderNavElements, addOrderInfoElements };
