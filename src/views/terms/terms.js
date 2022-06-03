import {
  addNavEventListeners,
  addNavElements,
  handleHamburger,
} from '../../components/Nav/event.js';

import { addFooterElements } from '../../components/Footer/event.js';

// 요소(element), input 혹은 상수

await addAllElements();
await addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  addNavElements();
  addFooterElements();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllEvents() {
  addNavEventListeners();
  handleHamburger();
}

let peterBar = new ProgressBar.Line('#peter-parker', {
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
      top: '.5vh',
      padding: 0,
      margin: 0,
      transform: null,
    },
    autoStyleContainer: false,
  },
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 500) + ' 만원');
  },
});

let DoctorStrangeBar = new ProgressBar.Line('#doctor-strange', {
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
      top: '.5vh',
      padding: 0,
      margin: 0,
      transform: null,
    },
    autoStyleContainer: false,
  },
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 500) + ' 만원');
  },
});

let ironManBar = new ProgressBar.Line('#iron-man', {
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
      top: '.5vh',
      padding: 0,
      margin: 0,
      transform: null,
    },
    autoStyleContainer: false,
  },
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 500) + ' 만원');
  },
});

let blackPantherBar = new ProgressBar.Line('#black-panther', {
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
      top: '.5vh',
      padding: 0,
      margin: 0,
      transform: null,
    },
    autoStyleContainer: false,
  },
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 500) + ' 만원');
  },
});

peterBar.animate(0.0);
DoctorStrangeBar.animate(0.1);
ironManBar.animate(0.4);
blackPantherBar.animate(1.0);
