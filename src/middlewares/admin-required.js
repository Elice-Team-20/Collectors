import { userService } from "../services";

// admin인지 검사하는 미들웨어
async function adminRequired(req, res, next) {

  try {
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