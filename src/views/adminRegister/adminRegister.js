import * as Api from '/api.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import {
  addItemInputFormElement,
  addCategoryElements,
  getCategoryItems,
} from '../../components/Admin/event.js';
import { addFooterElements } from '../../components/Footer/event.js';
import { checkAdmin } from '../../useful-functions.js';

window.onload = () => {
  // admin인지 확인하기
  if (!checkAdmin()) {
    alert('관리자 권한이 없습니다.');
    window.location.href = '/';
    return;
  }
};
let tags = []; //document.querySelectorAll('.tag-name');
let file;
let categoryList = await getCategoryItems(); // 카테고리 정보 가져오기
const categoryMap = categoryList.reduce((map, val, idx) => {
  map[val] = idx + 1;
  return map;
}, {}); // 카테고리 인덱스화
// 요소(element), input 혹은 상수
await addAllElements();
await addAllEvents();

async function addAllElements() {
  addNavElements('User');
  await addItemInputFormElement('상품 등록하기');
  await addCategoryElements(categoryList);
  addFooterElements();
}

async function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  document
    .querySelector('#addTagBtn')
    .addEventListener('click', handleAddTagBtn);
  document
    .querySelector('#registerItemBtn')
    .addEventListener('click', handleRegisterItemBtn);
  document
    .querySelector('#imgFileInput')
    .addEventListener('change', handleImgFileInput);
  document
    .querySelector('#categorySelector')
    .addEventListener('change', handleCategorySelect);
}

function handleImgFileInput(e) {
  // 이미지 업로드 관련 함수
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
function handleCategorySelect() {
  // 카테고리 처리 함수
  if (this.selectedIndex === categoryList.length + 1) {
    // 카테고리 직접 추가하기 옵션
    document.querySelector('#categoryTextInputDiv').innerHTML = `
    <input
      class="input"
      id="categoryTextInput"
      type="text"
      placeholder="직접 추가하기"
      autocomplete="off"
    />
  `;
  } else {
    // 그 외 옵션
    document.querySelector('#categoryTextInputDiv').innerHTML = '';
  }
}
function handleAddTagBtn(e) {
  // 태그 추가 버튼 함수
  e.preventDefault();
  const tagInput = document.querySelector('#tagInput');
  tags = [tagInput.value, ...tags];
  addTagElements();
  tagInput.value = '';
}
function addTagElements() {
  // 태그 엘리먼트 추가 함수
  const tagListDiv = document.querySelector('#tagList');

  tagListDiv.innerHTML = tags.reduce((text, tag) => {
    return text + addTagElement(tag);
  }, ``);
  addTagDeleteEvents();
}
function addTagElement(value) {
  // 태그 엘리먼트 반환 함수
  return `<div class="tag-name">${value}</div>`;
}
function addTagDeleteEvents() {
  // 태그 삭제 이벤트 할당 함수
  document.querySelectorAll('.tag-name').forEach((node) => {
    node.addEventListener('click', handleTagDeleteEvent);
  });
}
function handleTagDeleteEvent() {
  // 태그 삭제 이벤트 처리 함수
  tags = tags.filter((value) => value !== this.innerText);
  addTagElements();
}
async function handleRegisterItemBtn(e) {
  // 상품 등록 버튼 처리 함수
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
  if (!confirm('상품을 등록하시겠습니까?')) return;
  try {
    // 카테고리 추가
    let categoryName;
    if (categorySelector.selectedIndex === categoryList.length + 1) {
      // 직접 추가하기라면
      categoryName = document.querySelector('#categoryTextInput').value;
      await Api.post('/api/category', { categoryName }); // 카테고리 새로 생성
    } else {
      categoryName =
        categorySelector.options[categorySelector.selectedIndex].text;
    }
    // 아이템 정보
    let formData = new FormData();
    formData.append('itemName', itemNameInput.value);
    formData.append('category', categoryName);
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
