import * as Api from '/api.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../../components/Nav/event.js';
import { addItemInputFormElement } from '../../components/Admin/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

window.onload = () => {
  // admin인지 확인하기
};
let tags = []; //document.querySelectorAll('.tag-name');
let file;

// 요소(element), input 혹은 상수
await addAllElements();
await addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  addItemInputFormElement();
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  addNavEventListeners();
  //   console.log(document.querySelector('#addTagBtn'));
  document
    .querySelector('#addTagBtn')
    .addEventListener('click', handleAddTagBtn);
  document
    .querySelector('#registerItemBtn')
    .addEventListener('click', handleRegisterItemBtn);
  document
    .querySelector('#imgFileInput')
    .addEventListener('change', handleImgFileInput);
}

function handleImgFileInput(e) {
  // e.select();
  const imgFileInput = document.querySelector('#imgFileInput');
  const imgFileBoxDiv = document.querySelector('#imgFileBox');

  if (imgFileInput.files.length === 0) {
    return alert('이미지 파일이 선택되지 않았습니다.');
  }
  file = imgFileInput.files[0];

  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = (e) => {
    imgFileBoxDiv.innerHTML = `<img src=${fileReader.result} alt="item image"/>`;
  };
}
function handleAddTagBtn(e) {
  const tagListDiv = document.querySelector('#tagList');
  const tagInput = document.querySelector('#tagInput');
  e.preventDefault();
  tagListDiv.innerHTML += `
        <div class="tag-name">${tagInput.value}</div>
    `;
  tags = [tagInput.value, ...tags];
  tagInput.value = '';
}
async function handleRegisterItemBtn(e) {
  e.preventDefault();
  const itemNameInput = document.querySelector('#itemNameInput');
  const categorySelector = document.querySelector('#categorySelector');
  const companyInput = document.querySelector('#companyInput');
  const summaryInput = document.querySelector('#summaryInput');
  const mainExlainInput = document.querySelector('#mainExlainInput');
  const stockInput = document.querySelector('#stockInput');
  const priceInput = document.querySelector('#priceInput');
  if (!itemNameInput.value) {
    return alert('제품 이름이 작성되지 않았습니다.');
  }
  if (categorySelector.selectedIndex === 0) {
    return alert('카테고리를 지정해주세요.');
  }
  if (!companyInput.value) {
    return alert('제조사가 작성되지 않았습니다.');
  }
  if (!summaryInput.value) {
    return alert('요약 설명이 작성되지 않았습니다.');
  }
  if (!mainExlainInput.value) {
    return alert('상세 설명이 작성되지 않았습니다.');
  }
  if (!file) {
    return alert('이미지가 추가 되지 않았습니다.');
  }
  if (!stockInput.value) {
    return alert('재고가 작성되지 않았습니다.');
  }
  if (!priceInput.value) {
    return alert('가격이 작성되지 않았습니다.');
  }
  if (tags.length === 0) {
    return alert('태그를 적어도 하나 추가해주세요.');
  }

  try {
    let formData = new FormData();
    formData.append('itemName', itemNameInput.value);
    formData.append(
      'category',
      categorySelector.options[categorySelector.selectedIndex].value,
    );
    formData.append('manufacturingCompany', companyInput.value);
    formData.append('summary', summaryInput.value);
    formData.append('mainExplanation', mainExlainInput.value);
    formData.append('file', file); //
    formData.append('price', priceInput.value); //
    formData.append('stocks', stockInput.value);
    formData.append('hashTag', tags);

    const res = await Api.postFromData('/api/item', formData);
    alert(`정상적으로 상품이 등록되었습니다.`);

    // 관리자 페이지로 이동
    window.location.href = '/admin';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
