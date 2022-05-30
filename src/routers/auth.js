import { Router } from 'express';
import passport from 'passport'
import fetch from 'cross-fetch';
import { kakaoOAuthService } from '../services/index'

const authRouter = Router();

authRouter.get('/kakao/start',(req, res, next) =>{

  const url  = kakaoOAuthService.makeUrlKakaoToken()
  res.redirect(url)
})


authRouter.get('/kakao/finish', async(req, res, next) => {
  const REST_API_KEY = process.env.KAKAO_KEY;
  const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
  const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
    client_id: REST_API_KEY,
    client_secret: KAKAO_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: 'http://localhost:5000/api/auth/kakao/finish',
    code: req.query.code,
  };
  try{
    const params = new URLSearchParams(config).toString()
    const url = `${baseUrl}?${params}`;
    const kakaoTokentRequest = await fetch(url, {
      method:"POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    const kakaoTokentRequestJson = await kakaoTokentRequest.json()
    // 토큰이 있다면 정보 달라고 요청
    if("access_token" in kakaoTokentRequestJson){
      const { access_token } = kakaoTokentRequestJson;
      const userReuest = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization : `Bearer ${access_token}`,
            "Content-type": "application/json",
          }
        })
       const userReuestJson = await userReuest.json()
       const {email} = userReuestJson.kakao_account;
       console.log(userReuestJson)
       res.json(email)

    }
    else{
      throw new Error("토큰이 없습니다.")
    }
  }
  catch(er){
    return res.status(500).json({
      success: false,
      error: err.toString()
    })
  }
});

export {authRouter}
