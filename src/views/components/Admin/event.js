import { ItemInputForm } from './index.js';

const content = document.querySelector('#content');

const addItemInputFormElement = async (btnName) => {
  content.insertAdjacentHTML('beforeend', ItemInputForm(btnName));
};

export { addItemInputFormElement };
