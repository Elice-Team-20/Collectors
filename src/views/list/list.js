// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import * as Api from '/api.js';
import { addCommas } from '/useful-functions.js';

// const itemImage = document.querySelector('.item-img');
// const manufacturer = document.querySelector('.manufacturer');
// const Name = document.querySelector('.item-name');
// const recommended = document.querySelector('.recommended');
// const price = document.querySelector('.price');
// const detail = document.querySelector('.detail');

// GET / api/item/?id= ...

const ITEMLIST = document.querySelector('.item-list');

insertItemElement();

async function insertItemElement() {
  const response = await fetch(`/api/item`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const item = await response.json();
  console.log(item);

  // {itemName, category, manufacturingCompany, summary, mainExplanation, file, stocks, price, hashTag }

  const { itemName, category, manufacturingCompany, summary, mainExplanation, file, stocks, price, hashTag } = item;

  ITEMLIST.insertAdjacentHTML(
    'beforeend',
    `
    <div class="box product-item">
      <div>
        <figure>
          <img id="productImage" src="${file}" alt="clothes-image" />
        </figure>
      </div>
      <div class="description">
        <div class="detail">
          <h1 id="productTitle">${itemName}</h1>
          <p id="productDescription">${mainExplanation}</p>
        </div>
        <div class="price">
          <h1 id="productPrice">${addCommas(price)}</h1>
        </div>
      </div>
    </div>
  `
  );
}
