import fetch from 'cross-fetch';

class KakaoOAuthService{
  makeUrlKakaoToken() {
    const REST_API_KEY = process.env.KAKAO_KEY
    const REDIRECT_URI = 'http://localhost:5000/api/auth/kakao/finish'
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    return url
  }

}

const kakaoOAuthService = new KakaoOAuthService()

export { kakaoOAuthService }


