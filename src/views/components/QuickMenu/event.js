import { QuickMenu } from './index.js'; // 사이드 퀵 메뉴 컴포넌트
import { selectElement } from '/useful-functions.js';

const quickMenu = QuickMenu();

const addQuickMenuElement = (_quickMenu) => {
  _quickMenu.innerHTML = quickMenu;

  addRecentItem();

  // 최근 본 상품 추가하기
  function addRecentItem() {
    const quickItems = selectElement('.quick-items');
    let recentItems = JSON.parse(localStorage.getItem('recentItem')) || [];

    if (!recentItems) return;

    // 추가하기
    recentItems.forEach(({ itemId, itemName, imgUrl }) => {
      const recentItemList = `
        <li class="recent-item">
          <a href="/item/?id=${itemId}">
            <img src="${imgUrl}" alt="${itemName}">
            <p>${itemName}</p>
          </a>
        </li>
      `;

      quickItems.insertAdjacentHTML('beforeend', recentItemList);
    });
  }
};

const addQuickMenuEventListeners = (quickMenu) => {
  // 퀵 메뉴 설정
  window.addEventListener('scroll', () => {
    let y = +window.scrollY;
    y > 300
      ? (quickMenu.style.top = y + 300 + 'px')
      : (quickMenu.style.top = '95vh');
  });
};

const handleTopButton = () => {
  const topButton = selectElement('.top');

  window.addEventListener('scroll', () => {
    let y = window.pageYOffset;
    if (y > 300) {
      topButton.style.bottom = 1 + 'em';
    } else {
      topButton.style.bottom = -1 + 'em';
    }
  });

  topButton.addEventListener('click', () => {
    window.scrollTo(0, 0);
  });
};

export { addQuickMenuElement, addQuickMenuEventListeners, handleTopButton };
