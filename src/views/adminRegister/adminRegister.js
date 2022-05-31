import * as Api from '/api.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

window.onload = () => {
  // admin인지 확인하기
};

const itemNameInput = document.querySelector('#itemNameInput');
const categorySelector = document.querySelector('#categorySelector');
const companyInput = document.querySelector('#companyInput');
const summaryInput = document.querySelector('#summaryInput');
const mainExlainInput = document.querySelector('#mainExlainInput');
const imgFileInput = document.querySelector('#imgFileInput');
let imgFileUrl = ``;
const stockInput = document.querySelector('#stockInput');
const priceInput = document.querySelector('#priceInput');
const tagInput = document.querySelector('#tagInput');
const addTagBtn = document.querySelector('#addTagBtn');
const tagListDiv = document.querySelector('#tagList');
let tags = []; //document.querySelectorAll('.tag-name');
let file;
const registerItemBtn = document.querySelector('#registerItemBtn');
console.log(categorySelector);
// 요소(element), input 혹은 상수
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  addTagBtn.addEventListener('click', handleAddTagBtn);
  registerItemBtn.addEventListener('click', handleRegisterItemBtn);
  imgFileInput.addEventListener('change', handleImgFileInput);
}
function handleImgFileInput(e) {
  // e.select();
  if (imgFileInput.files.length === 0) {
    return alert('이미지 파일이 선택되지 않았습니다.');
  }
  // document.selection.createRangeCollection()[0].text.toString();
  console.log('이미지', imgFileInput.files[0]);
  file = imgFileInput.files[0];
  console.log(file);
  // console.log(file);
  // imgFileUrl = imgFileInput.value;
  // console.log(imgFileUrl);
  // const fileReader = new FileReader();
  // fileReader.readAsDataURL(imgFileInput.files[0]);
  // fileReader.onloadend = (e) => {
  //   console.log(e);
  //   imgFileUrl = e.target.result;
  //   document.querySelector(
  //     '#imgFileBox',
  //   ).innerHTML = `<img src=${imgFileUrl}/>`;
  //   console.log(imgFileUrl);
  // };
}
function handleAddTagBtn() {
  tagListDiv.innerHTML += `
        <div class="tag-name">${tagInput.value}</div>
    `;
  tags = [tagInput.value, ...tags];
  console.log('tag', tags);
  tagInput.value = '';
}
async function handleRegisterItemBtn() {
  console.log(
    categorySelector.selectedIndex,
    categorySelector.options[categorySelector.selectedIndex].value,
  );
  console.log('등록 버튼');
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
  // 제품 사진
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
    const itemData = {
      itemName: itemNameInput.value,
      category: categorySelector.options[categorySelector.selectedIndex].value,
      manufacturingCompany: companyInput.value,
      summary: summaryInput.value,
      mainExplanation: mainExlainInput.value,
      file, // 임시
      stocks: stockInput.value,
      price: priceInput.value,
      hashTag: tags,
    };
    console.log(itemData);
    const res = await Api.post('/api/item/', itemData);
    console.log(res);
    alert(`정상적으로 상품이 등록되었습니다.`);

    // 관리자 페이지로 이동
    window.location.href = '/admin';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
