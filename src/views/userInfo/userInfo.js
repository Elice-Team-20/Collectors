import * as Api from '/api.js';
import { selectElement } from '/useful-functions.js';

import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';
import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수
const userTierImage = selectElement('.user-tier-img');
const submitButton = selectElement('#submitButton');
const fullNameInput = selectElement('#fullNameInput');
const userTierInput = selectElement('#userTierInput');
const emailInput = selectElement('#emailInput');
const phoneNumberInput = selectElement('#phoneNumberInput');

addAllElements();
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/user/edit';
  });
}

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements('UserInfo');
  addFooterElements();
  getUserDataToInput();
}

// 유저 데이터 삽입하기
async function getUserDataToInput() {
  // user 아이디 가져오기
  const id = await Api.get(`/api/user/id`);

  // 유저 데이터 가져오기
  const userData = await Api.get(`/api/user/${id}`);
  const tier = await Api.get(`/api/user/role`);
  const mininmalCost = {
    '피터 파커': 501000,
    '닥터 스트레인지': 1001000,
    '토니 스타크': 2001000,
    '블랙 팬서': 5000000,
  };
  // 티어별 이미지 교체
  if (tier === '피터 파커') {
    userTierImage.src = '/user-tier-1.png';
  } else if (tier === '닥터 스트레인지') {
    userTierImage.src = '/user-tier-2.png';
  } else if (tier === '토니 스타크') {
    userTierImage.src = '/user-tier-3.png';
  } else if (tier === '블랙 팬서') {
    userTierImage.src = '/user-tier-4.png';
  }

  // 유저 데이터 가져와서 삽입
  const { fullName, email, phoneNumber, accumulatedTotalCost } = userData;
  fullNameInput.value = fullName;
  userTierInput.value = tier;
  emailInput.value = email;
  phoneNumberInput.value = phoneNumber;

  // 원형 프로그래스 바 삽입하기
  let tierBar = new ProgressBar.Circle('#user-tier', {
    color: '#f01e21',
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 2000,
    text: {
      autoStyleContainer: true,
    },
    from: { color: '#f01e21', width: 4 },
    to: { color: '#f01e21', width: 4 },
    step: function (state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);

      let value = Math.round(circle.value() * mininmalCost[tier]);
      if (value === 0) {
        circle.setText('');
      } else {
        circle.setText(value);
      }
    },
  });
  tierBar.text.style.display = 'none';

  tierBar.animate(accumulatedTotalCost / mininmalCost[tier]);

  // 유저 스탯 삽입
  const { equipment, magic, intelligence, psychic } = userData.stat;

  // 유저 스탯 프로그래스 바 추가하기

  // 마법 스탯 프로그래스 바 추가
  let magicStat = new ProgressBar.Line('#magic', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 2000,
    color: '#FFEA82',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
      style: {
        color: '#999',
        position: 'absolute',
        right: '0',
        top: '-3.5vh',
        padding: 0,
        margin: 0,
        transform: null,
      },
      autoStyleContainer: false,
    },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100));
    },
  });

  // 장비 스탯 프로그래스 바 추가
  let equipmentStat = new ProgressBar.Line('#equipment', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 2000,
    color: 'yellow',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
      style: {
        color: '#999',
        position: 'absolute',
        right: '0',
        top: '-3.5vh',
        padding: 0,
        margin: 0,
        transform: null,
      },
      autoStyleContainer: false,
    },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100));
    },
  });

  // 초능력 스탯 프로그래스 바 추가
  let psychicStat = new ProgressBar.Line('#psychic', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 2000,
    color: 'red',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
      style: {
        color: '#999',
        position: 'absolute',
        right: '0',
        top: '-3.5vh',
        padding: 0,
        margin: 0,
        transform: null,
      },
      autoStyleContainer: false,
    },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100));
    },
  });

  // 지능 스탯 프로그래스 바 추가
  let intelligenceStat = new ProgressBar.Line('#intelligence', {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 2000,
    color: '#fff',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' },
    text: {
      style: {
        color: '#999',
        position: 'absolute',
        right: '0',
        top: '-3.5vh',
        padding: 0,
        margin: 0,
        transform: null,
      },
      autoStyleContainer: false,
    },
    step: (state, bar) => {
      bar.setText(Math.round(bar.value() * 100));
    },
  });

  // 애니메이션 추가
  magicStat.animate(magic / 100 || 0);
  equipmentStat.animate(equipment / 100 || 0);
  psychicStat.animate(psychic / 100 || 0);
  intelligenceStat.animate(intelligence / 100 || 0);
}
