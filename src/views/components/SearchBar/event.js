import { SearchBar } from './index.js'; // 장바구니, 주문 결제 컴포넌트

const addSearchBarElement = () => {
  document.querySelector('#searchBar').innerHTML = SearchBar();
};

export { addSearchBarElement };
