export const OrderNav = (page) => {
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
export default OrderNav;
