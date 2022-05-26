// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { addCommas } from '/useful-functions.js';

import { addNavEventListeners, addNavElements } from '../components/Nav/event.js';
import { addFooterElements } from '../components/Footer/event.js';
import { addOrderNavElements, addOrderInfoElements } from '../components/Order/event.js';

// const itemPrice = document.querySelector('#item-price');
// const itemNumber = document.querySelector('#item-number');
// const shipping = document.querySelector('#shipping');
// const total = document.querySelector('#total');

addAllElements();
addAllEvents();

async function addAllElements() {
  addNavElements();
  addFooterElements();
  addOrderNavElements('Cart');
  addOrderInfoElements('Cart');

  insertItemElement();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
}

// 구매하기 버튼 처리
// 로컬 스토리지에서 데이터 가져오기
