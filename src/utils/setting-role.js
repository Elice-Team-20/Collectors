// 레벨 지정
// 피터파커 : 0~ 50만원
// 닥터 스트레인지 : 50~200만원
// 토니 스타크: 200~500만원
// 블랙팬서: 500만원 이상
function setRole(cost) {
  if (cost >= 5000000) {
    return '블랙 팬서';
  } else if (cost >= 2000000) {
    return '토니 스타크';
  } else if (cost >= 500000) {
    return '닥터 스트레인지';
  } else {
    return '피터 파커';
  }
}

export { setRole };
