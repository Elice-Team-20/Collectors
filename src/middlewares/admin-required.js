import { userService } from "../services";

// admin인지 검사하는 미들웨어
async function adminRequired(req, res, next) {

  try {
    
    // 이전 미들웨어 (loginRequired)에서 현재 로그인한 유저의 아이디를 가져옴
    // 유저의 아이디를 검색해서 만약 admin이면(true일 경우) next, 아닐 경우 에러 처리
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);
    
    if(!user.isAdmin) {
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