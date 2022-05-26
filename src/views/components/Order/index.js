const OrderNav = (page) => {
  // let menu = "";
  // if (page === "Cart") {
  //   menu = `
  //   <div class="title">
  //     <p>장바구니</p>
  //     <p>주문 결제</p>
  //     <p>주문 완료</p>
  //   </div>
  //   `;
  // } else if (page === "Order") {
  //   menu = `
  //   <div class="title">
  //     <p><a href="/cart" >장바구니</a></p>
  //     <h1>주문 결제</h1>
  //     <p>주문 완료</p>
  //   </div>
  //   `;
  // } else {
  //   menu = `
  //   <div class="title">
  //     <p>장바구니</p>
  //     <p>주문 결제</p>
  //     <h1>주문 완료</h1>
  //   </div>
  //   `;
  // }

  // return `${menu}`;
  return `
    <div class="title">
      <p id="cart">장바구니</p>
      <p id="order">> 주문 결제</p>
      <p id="complete">> 주문 완료</p>
    </div>  
  `;
};

const OrderInfo = (page) => {
  let info = "";
  // let page = "";
  if (page === "Cart") {
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
  } else if (page === "Order") {
    info = `
    <div class="data order-list">
      <div id="order-title">주문 상품</div>
      <div id="order-items">
        <div>여성 니트 / 2개여성 니트 / 2개여성 니트 / 2개여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
        <div>여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
        <div>여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
        <div>여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
        <div>여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
        <div>여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
        <div>여성 니트 / 2개</div>
        <div>남성 니트 / 2개</div>
      </div>
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
  // return `
  //   <div class="info-name">
  //     결제 정보
  //     <div class="seperator"></div>
  //   </div>
  //   <div class="order-info">
  //     ${contents}
  //   </div>
  //   <div class="data total">
  //     <p>총 결제 금액</p>
  //     <p id="total">원</p>
  //   </div>
  // `;
};
export { OrderNav, OrderInfo };
