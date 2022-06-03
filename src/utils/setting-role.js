// 레벨 지정
// 피터파커 : 0~ 10만원
// 닥스 : 10~50 만원
// 토니 스타크: 50~ 200만원
// 블랙팬서: 200만원 이상
function setRole(cost) {
  if (cost >= 2000000) {
    return '블랙 팬서';
  } else if (cost >= 500000) {
    return '토니 스타크';
  } else if (cost >= 100000) {
    return '닥터 스트레인지';
  } else {
    return '피터 파커';
  }
}

export { setRole };
