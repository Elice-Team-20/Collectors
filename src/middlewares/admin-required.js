import { userService } from "../services";

// admin인지 검사하는 미들웨어
async function adminRequired(req, res, next) {

  try {
    const userId = req.currentUserId;
    console.log("admin", userId);
    const user = await userService.getUser(userId);
    console.log(user.isAdmin);
    
    if(!user.isAdmin) {
      throw new Error('관리자 계정이 아닙니다.');
    }

    next();
  } catch (error) {
    console.log(error);
  }
}

export { adminRequired };