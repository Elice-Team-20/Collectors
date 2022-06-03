import { Router } from 'express';
import { kakaoOAuthService } from '../services/index';
import passport from 'passport';

const authRouter = Router();

// url 을 생성하고 카카오에 토큰요청
authRouter.get('/kakao/start', (req, res, next) => {
  const url = kakaoOAuthService.makeUrlKakaoToken();

  //카카오에 등록된 redirect 로 이동
  res.status(200).redirect(url);
});

// 토큰인증을 받기 + 유저정보 요청/받기 + jwt 토큰 res 에 생성
authRouter.get('/kakao/finish', async (req, res, next) => {
  try {
    const REST_API_KEY = process.env.KAKAO_KEY;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
    const config = {
      client_id: REST_API_KEY,
      client_secret: KAKAO_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:5000/api/auth/kakao/finish',
      code: req.query.code,
    };

    // 유저 정보 요청
    const userInfo = await kakaoOAuthService.requestUser(config);
    // 우리 db에 있는지 확인
    const isthereDB = await kakaoOAuthService.checkMember(userInfo);
    let user = null;

    //회원정보가 db에 없으면
    if (!isthereDB) {
      //회원정보 등록
      user = await kakaoOAuthService.signUp(userInfo);
    }
    //있으면
    else {
      const { email } = userInfo.kakao_account;
      //기존회원이면 회원 정보 찾아옴
      user = await kakaoOAuthService.getUserByEmail(email);
    }
    //만약 유저정보가 등록도 안되고 db에서 찾는것도 안되면 다음 오류 발생
    if (!user) {
      res.status(400).send('유저 정보가 할당이 안됩니다 양식을 확인하세요');
    }
    // 토큰 생성
    const token = await kakaoOAuthService.getToken(user);
    res.cookie('token', token.token);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

authRouter.get(
  '/naver',
  passport.authenticate('naver', { authType: 'reprompt' }),
);

authRouter.get(
  '/naver/callback',
  passport.authenticate('naver', { session: false }),
  (req, res, next) => {
    try {
      // res.status(200).json({"token": req.user.token});
      const token = req.user.token;
      res.cookie('token', token);
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },
);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res, next) => {
    try {
      // res.status(200).json({"token": req.user.token});
      const token = req.user.token;
      res.cookie('token', token);
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  },
);

export { authRouter };
