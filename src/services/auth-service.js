import fetch from 'cross-fetch';
import { userService } from '../services/index';
class KakaoOAuthService{
  constructor(inputUserService){
    this.userService = inputUserService
  }
  makeUrlKakaoToken () {
    const REST_API_KEY = process.env.KAKAO_KEY
    const REDIRECT_URI = 'http://localhost:5000/api/auth/kakao/finish'
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    return url
  }

  async requestUser (config) {
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

        return userReuestJson
      }
      else{
        throw new Error( "토큰이 없습니다." )
      }
  }
// 회원인지 검사 개체지향에  책임을 분리원칙
//..? 일단 분리 했는데 통합하는것이에 보기에 맞는거 같기도 하고
  async checkMember (userInfo) {
    const{email} = userInfo.kakao_account;
    console.log(email)
    const getDBEmail = userService.getUserByEmail(email);
    return getDBEmail;
  }

  async signUp (userInfo){
    const { email, profile } = userInfo.kakao_account;
    const {nickname} = profile
    const userData = {
      email: email,
      fullName: nickname,
      password: Math.floor(Math.random() * 100000000).toString(),
    }
    return await this.userService.addUser(userData);
  }

  async getToken(){
    const secretKey = process.env.JWT_SECRET_KEY ||'secret-key'
    //const token = jwt.sign({})
  }
//
}

const kakaoOAuthService = new KakaoOAuthService(userService)

export { kakaoOAuthService }


