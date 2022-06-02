import * as Api from '/api.js';

import {
  addNavEventListeners,
  addNavElements,
} from '../../../components/Nav/event.js';
import { addItemInputFormElement } from '../../../components/Admin/event.js';
import { addFooterElements } from '../../../components/Footer/event.js';
import { checkAdmin } from '../../../useful-functions.js';

window.onload = () => {
  // admin인지 확인하기
  if (!checkAdmin()) {
    alert('관리자 권한이 없습니다.');
    window.location.href = '/';
    return;
  }
};
let file;
let tags = [];
let isImgChanged = false; // 이미지 리소스 낭비 방지
// const queryString = window.location.search;
const id = new URLSearchParams(window.location.search).get('id');
console.log(id);
const categoryMap = { 히어로: 1, 빌런: 2 };
// 요소(element), input 혹은 상수
await addAllElements();
await addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('User');
  await addItemInputFormElement('상품 수정하기');
  await addItemInputOriginElement();
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
async function addItemInputOriginElement() {
  const itemNameInput = document.querySelector('#itemNameInput');
  const categorySelector = document.querySelector('#categorySelector');
  const companyInput = document.querySelector('#companyInput');
  const summaryInput = document.querySelector('#summaryInput');
  const mainExlainInput = document.querySelector('#mainExlainInput');
  const imgFileBoxDiv = document.querySelector('#imgFileBox');
  const stockInput = document.querySelector('#stockInput');
  const priceInput = document.querySelector('#priceInput');
  const tagListDiv = document.querySelector('#tagList');

  const {
    itemName,
    category,
    manufacturingCompany,
    summary,
    mainExplanation,
    imgUrl,
    stocks,
    price,
    hashTag,
  } = await getOriginItemInfo();
  itemNameInput.value = itemName;
  console.log(categoryMap[category]);
  categorySelector.selectedIndex = categoryMap[category];
  companyInput.value = manufacturingCompany;
  summaryInput.value = summary;
  mainExlainInput.value = mainExplanation;
  imgFileBoxDiv.innerHTML = `<img src=${imgUrl} alt="item image"/>`;
  stockInput.value = stocks;
  priceInput.value = price;
  console.log(hashTag[0]);
  hashTag[0].split(',').forEach((tag) => {
    tags.push(tag);
    // tagListDiv.innerHTML += addTagElement(tag);
  });
  addTagElements(); // 태그 추가
}

async function getOriginItemInfo() {
  try {
    const itemInfo = await Api.get(`/api/item/${id}`);
    return itemInfo;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
function handleImgFileInput(e) {
  // e.select();
  const imgFileInput = document.querySelector('#imgFileInput');
  const imgFileBoxDiv = document.querySelector('#imgFileBox');

  if (imgFileInput.files.length === 0) {
    return alert('이미지 파일이 선택되지 않았습니다.');
  }
  file = imgFileInput.files[0];
  isImgChanged = true;
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = (e) => {
    imgFileBoxDiv.innerHTML = `<img src=${fileReader.result} alt="item image"/>`;
  };
}

function handleAddTagBtn(e) {
  // 태그 추가
  e.preventDefault();
  const tagInput = document.querySelector('#tagInput');
  tags = [tagInput.value, ...tags];
  addTagElements();
  tagInput.value = '';
}
function addTagElements() {
  // tagElement 모두 추가
  const tagListDiv = document.querySelector('#tagList');

  tagListDiv.innerHTML = tags.reduce((text, tag) => {
    return text + addTagElement(tag);
  }, ``);
  // tagListDiv.innerHTML += addTagElement(tagInput.value);
  addTagDeleteEvents();
}
function addTagElement(value) {
  //각 tag element 추가
  return `<div class="tag-name">${value}</div>`;
}
function addTagDeleteEvents() {
  // 태그 삭제 이벤튼
  document.querySelectorAll('.tag-name').forEach((node) => {
    node.addEventListener('click', handleTagDeleteEvent);
  });
}
function handleTagDeleteEvent() {
  console.log('tag clicked', this.innerText);
  tags = tags.filter((value) => value !== this.innerText);
  addTagElements();
  console.log('after', tags);
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
  if (!stockInput.value) {
    return alert('재고가 작성되지 않았습니다.');
  }
  if (!priceInput.value) {
    return alert('가격이 작성되지 않았습니다.');
  }
  if (tags.length === 0) {
    return alert('태그를 적어도 하나 추가해주세요.');
  }
  if (!confirm('상품을 수정하시겠습니까?')) return;
  try {
    let formData = new FormData();
    formData.append('itemName', itemNameInput.value);
    formData.append(
      'category',
      categorySelector.options[categorySelector.selectedIndex].text,
    );
    formData.append('manufacturingCompany', companyInput.value);
    formData.append('summary', summaryInput.value);
    formData.append('mainExplanation', mainExlainInput.value);
    if (isImgChanged) formData.append('file', file); //
    formData.append('price', priceInput.value); //
    formData.append('stocks', stockInput.value);
    formData.append('hashTag', tags);

    const res = await Api.postFromData(`/api/item/update/${id}`, formData);
    alert(`정상적으로 상품이 수정되었습니다.`);
    // console.log(res);
    // 목록 페이지
    window.location.href = '/admin/manage';
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
