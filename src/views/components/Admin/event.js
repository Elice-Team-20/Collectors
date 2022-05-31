import { ItemInputForm } from './index.js';

const content = document.querySelector('#content');

const addItemInputFormElement = async () => {
  content.insertAdjacentHTML('beforeend', ItemInputForm());
};

export { addItemInputFormElement };
