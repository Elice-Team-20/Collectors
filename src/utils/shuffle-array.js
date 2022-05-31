// 배열에 있는 값을 랜덤으로 섞어주는 함수
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export { shuffle };
