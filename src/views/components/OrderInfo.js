export const OrderInfo = (page) => {
  let info = '';
  if (page === 'Cart') {
    info = `
    <div class="data">
      <p>상품 수</p>
      <p id="item-number">개</p>
    </div>
    <div class="data">
      <p>상품 금액</p>
      <p id="item-price">원</p>
    </div>
    <div class="data">
      <p>배송비</p>
      <p id="shipping">원</p>
    </div>
    `;
  } else if (page === 'Order') {
    info = `
    <div class="data">
      <p>주문 상품</p>
      <p id="ordered"></p>
    </div>
    <div class="data">
      <p>상품 총액</p>
      <p id="item-total-price">원</p>
    </div>
    <div class="data">
      <p>배송비</p>
      <p id="shipping">원</p>
    </div>
    `;
  } else {
    info = `
    <div class="data">
      <p>주문 상품</p>
      <p id="ordered"></p>
    </div>
    `;
  }

  return `${info}`;
};
export default OrderInfo;
