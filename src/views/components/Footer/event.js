import { Footer } from './index.js'; //푸터 컴포넌트
const footer = document.querySelector("footer")

const addFooterElements = () => {
    footer.innerHTML=Footer()
}

export { addFooterElements }