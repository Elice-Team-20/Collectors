import { ItemInputForm } from './index.js';
import * as Api from '../../api.js';

const content = document.querySelector('#content');
// let categoryList = [];

const addItemInputFormElement = async (btnName) => {
  content.insertAdjacentHTML('beforeend', ItemInputForm(btnName));
};
const addCategoryElements = async (categoryList) => {
  const categorySelector = document.querySelector('#categorySelector');
  categorySelector.insertAdjacentHTML(
    'beforeend',
    categoryList.reduce((text, categoryName) => {
      return (
        text +
        `
          <option>${categoryName}</option>
        `
      );
    }, ``) + `<option>직접 추가하기</option>`,
  );
};
const getCategoryItems = async () => {
  try {
    const result = await Api.get('/api/category');
    return result;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
};
export { addItemInputFormElement, addCategoryElements, getCategoryItems };
