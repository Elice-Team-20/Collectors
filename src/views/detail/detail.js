// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { addCommas } from '/useful-functions.js';

import { Nav } from '../components/Nav.js'; //네비게이션 컴포넌트
import { Footer } from '../components/Footer.js'; //푸터 컴포넌트

// GET / api/item/detail/?id= ...

const ITEMDETAIL = document.querySelector('item-detail');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id'); // shortId?
console.log(id);
insertItemDetail(id);

async function insertItemDetail(id) {
  const response = await fetch(`/api/item/${id}`);
  const details = await response.json();

  const { itemName, category, manufacturingCompany, summary, mainExplanation, file, stocks, price, hashTag } = details;

  ITEMDETAIL.insertAdjacentHTML(
    'beforeend',
    `
  <div class="item">
    <div>
      <figure>
        <img src="${file}" alt="item-image" />
      </figure>
    </div>
    <div class="description">
      <p>${manufacturingCompany}</p>
      <div class="detail">
        <h1>${itemName}</h1>
        <p>${mainExplanation}</p>
      </div>
      <div class="price">
        <h1>${addCommas(price)}</h1>
      </div>
    </div>
  </div>
  `
  );
}
