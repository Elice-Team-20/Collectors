import { Router } from 'express';
import { kakaoOAuthService } from '../services/index'

const authRouter = Router();

authRouter.get('/kakao/start',(req, res, next) =>{

  const url  = kakaoOAuthService.makeUrlKakaoToken()
  res.redirect(url)
})

authRouter.get('/kakao/finish', async(req, res, next) => {

  try{
    const REST_API_KEY = process.env.KAKAO_KEY;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

      const config = {
        client_id: REST_API_KEY,
        client_secret: KAKAO_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: 'http://localhost:5000/api/auth/kakao/finish',
        code: req.query.code,
      };
      const userInfo = await kakaoOAuthService.requestUser(config);
      const isthereDB = await kakaoOAuthService.checkMember(userInfo);
      let user = null;
      if(!isthereDB){
        //회원정보 등록
        user = await kakaoOAuthService.signUp(userInfo);
      }
      else{
        const { email } = userInfo.kakao_account;
        console.log(email)
        //기존회원이면 회원 정보 찾아옴
        user = await kakaoOAuthService.getUserByEmail(email)
      }

      if(!user){
        res.status(401).send("유저 정보가 할당이 안됩니다 양식을 확인하세요")
      }

      const  token = await kakaoOAuthService.getToken(user)
      console.log(token)
      res.status(201).json(token)
  }
  catch(err){
    next(err)
  }
});

export {authRouter}
