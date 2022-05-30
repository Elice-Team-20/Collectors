// admin인지 검사하는 미들웨어
async function adminRequired(req, res, next) {

  try {
    
    // 유저의 아이디를 검색해서 만약 admin이면(true일 경우) next, 아닐 경우 에러 처리

    // 20220530 수정 : userId로 다시 DB에 검색하는 것이 아니라,
    // 토큰에 저장된 isAdmin을 사용함.

    const isAdmin = req.isAdmin;
    console.log(isAdmin)
    
    if(!isAdmin) {
      throw new Error('관리자 계정이 아닙니다.');
    }

    next();
  } catch (error) {
    res.status(401).json({
      result: 'frobidden-approach',
      reason: '권한이 없습니다.',
    })
  }
}

export { adminRequired };