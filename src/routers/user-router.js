import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { userService } from '../services';

const userRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
userRouter.post('/register', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    // 회원가입 할때 주소를 받지 않는다.
    const { fullName, email, password } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
    });

    // 추가된 유저의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 로그인 api (아래는 /login 이지만, 실제로는 /api/login로 요청해야 함.)
userRouter.post('/login', async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    // jwt 토큰을 프론트에 보냄 (jwt 토큰은, 문자열임)
    res.status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});

// 전체 유저 목록을 가져옴 (배열 형태임)
// 미들웨어로 loginRequired 를 썼음 (이로써, jwt 토큰이 없으면 사용 불가한 라우팅이 됨)
userRouter.get('/userlist', loginRequired, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await userService.getUsers();

    // 사용자 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// user 아이디를 반환하는 api
userRouter.get('/id', loginRequired, async function (req, res, next) {
  try {
    const id = req.currentUserId;
    res.status(200).json(id);
  } catch (error) {
    next(error);
  }
});

// 관리자인지 검사
userRouter.get('/isAdmin', loginRequired, async function (req, res, next) {
  try {
    const id = req.currentUserId;
    const result = await userService.isAdmin(id);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});

// 유저의 등급 리턴
userRouter.get('/role', loginRequired, async (req, res, next) => {
  try {
    const id = req.currentUserId;
    const result = await userService.getUserRole(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// 유저아이디 에 맞는 유저 정보 가져옴 만약 주문 정보 가 있으면 주문정보도 보여주는 api
userRouter.get('/:userId', loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.patch(
  '/users/:userId/address',
  loginRequired,
  async (req, res, next) => {
    try {
      const address = req.body;
      const { userId } = req.params;
      const result = await userService.noPasswordUpdateAddress(userId, address);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);

// 사용자 정보 수정
// (예를 들어 /api/users/abc12345 로 요청하면 req.params.userId는 'abc12345' 문자열로 됨)
userRouter.patch(
  '/users/:userId',
  loginRequired,
  async function (req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }

      // params로부터 id를 가져옴
      const userId = req.params.userId;

      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const fullName = req.body.fullName;
      const password = req.body.password;
      const address = req.body.address;
      const phoneNumber = req.body.phoneNumber;
      const role = req.body.role;

      // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
      const currentPassword = req.body.currentPassword;

      // currentPassword 없을 시, 진행 불가
      if (!currentPassword) {
        throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
      }

      const userInfoRequired = { userId, currentPassword };

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(fullName && { fullName }),
        ...(password && { password }),
        ...(address && { address }),
        ...(phoneNumber && { phoneNumber }),
        ...(role && { role }),
      };

      // 사용자 정보를 업데이트함.
      const updatedUserInfo = await userService.setUser(
        userInfoRequired,
        toUpdate,
      );

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(201).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  },
);

// loginRequired 체크하고 유저 정보를 제거하는 api
userRouter.delete('/delete/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new Error('회원 탈퇴를 위해서는 비밀번호 입력이 필요합니다.');
    }

    const result = await userService.deleteUser(userId, password);

    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({ result: '정상적으로 회원 정보가 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
});
// 비밀번호가 맞는지 확인해주는 라우터
userRouter.post('/checkPassword/:userEmail', async (req, res, next) => {
  try {
    const { password } = req.body;
    const { userEmail } = req.params;
    const result = await userService.checkPassword(userEmail, password);
    res.status(200).json({ res: result });
  } catch (err) {
    next(err);
  }
});

export { userRouter };
