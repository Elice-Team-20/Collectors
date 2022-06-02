import { CategoryMenu } from './index.js'; // 카테고리 메뉴 컴포넌트
import * as Api from '/api.js';

const categoryMenu = CategoryMenu();

const addCategoryMenuElement = (category) => {
  category.innerHTML = categoryMenu;
  addCategoryName();

  // 카테고리 가져오기
  async function getCategoryName() {
    const categoryData = await Api.get(`/api/category`);

    return categoryData;
  }

  // 카테고리 메뉴 추가하기
  async function addCategoryName() {
    const categoryList = document.querySelector('.category-list');
    const categoryNames = await getCategoryName();

    categoryNames.forEach((name) => {
      const categoryName = `<li class="category-item"><a href="/items?category=${name}">${name}</a></li>`;
      categoryList.insertAdjacentHTML('beforeend', categoryName);
    });
  }
};

const addCategoryMenuEventListeners = () => {
  const categoryButton = document.querySelector('.category-expand');
  const categoryList = document.querySelector('.category-list');

  categoryButton.addEventListener('click', () => {
    categoryList.classList.toggle('hidden');
  });
};

export { addCategoryMenuElement, addCategoryMenuEventListeners };
