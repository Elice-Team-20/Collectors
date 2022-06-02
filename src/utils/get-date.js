// createdAt 형태의 날짜 데이터(2022-05-31T12:28:22.679+00:00)를
// YYYY-MM-DD로 바꿔주는 함수
function getDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
}

export { getDate };
