import { Router } from 'express';
import passport from 'passport'
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
      const email = await kakaoOAuthService.requestUserEmail(config)
      res.json({'email':email})
  }
  catch(err){
    next(err)
  }
});

export {authRouter}
