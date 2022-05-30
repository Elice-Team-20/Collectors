import fetch from 'cross-fetch';

class KakaoOAuthService{
  makeUrlKakaoToken () {
    const REST_API_KEY = process.env.KAKAO_KEY
    const REDIRECT_URI = 'http://localhost:5000/api/auth/kakao/finish'
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    return url
  }

  async requestUserEmail (config) {
      const baseUrl = "https://kauth.kakao.com/oauth/token";
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
              'Content-type': 'application/json',
            }
          })
        const userReuestJson = await userReuest.json()
        const {email} = userReuestJson.kakao_account;
        return email
      }
      else{
        throw new Error("토큰이 없습니다.")
      }
    }
}

const kakaoOAuthService = new KakaoOAuthService()

export { kakaoOAuthService }


