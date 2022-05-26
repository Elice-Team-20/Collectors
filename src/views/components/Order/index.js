const OrderNav = (page) => {
  let menu = '';
  if (page === 'Cart') {
    menu = `
    <div class="title">
      <h1>장바구니</h1>
      <p>주문 결제</p>
      <p>주문 완료</p>
    </div>
    `;
  } else if (page === 'Order') {
    menu = `
    <div class="title">
      <p><a href="/cart" >장바구니</a></p>
      <h1>주문 결제</h1>
      <p>주문 완료</p>
    </div>
    `;
  } else {
    menu = `
    <div class="title">
      <p>장바구니</p>
      <p>주문 결제</p>
      <h1>주문 완료</h1>
    </div>
    `;
  }

  return `${menu}`;
};

const OrderInfo = (page) => {
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
export { OrderNav, OrderInfo };
