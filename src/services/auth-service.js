import fetch from 'cross-fetch';
import { userService } from '../services/index';
import jwt from 'jsonwebtoken';
class KakaoOAuthService{
  constructor(inputUserService){
    this.userService = inputUserService
  }

  async getUserByEmail(email){
    return await this.userService.getUserByEmail(email);
  }

  // 카카오 토큰 요청 url 작성 함수
  makeUrlKakaoToken () {
    const REST_API_KEY = process.env.KAKAO_KEY
    const REDIRECT_URI = 'http://localhost:5000/api/auth/kakao/finish'
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    return url
  }

  // 카카오 에 토근 을 요청하고 사용자 정보 가져오는 함수
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
        const userReueslt = await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: {
              Authorization : `Bearer ${access_token}`,
              'Content-type': 'application/json',
            }
          })
        const userReuesltJson = await userReueslt.json()
        return userReuesltJson
      }
      else{
        throw new Error( "토큰이 없습니다." )
      }
  }
  // 회원인지 검사 하는 함수
  async checkMember (userInfo) {
    const{email} = userInfo.kakao_account;
    const getDBEmail = await this.userService.getUserByEmail(email);
    return getDBEmail;
  }

  //회원 우리db에 등록 하는 함수
  async signUp (userInfo){
    const { email, profile } = userInfo.kakao_account;
    const {nickname} = profile
    const userData = {
      email: email,
      fullName: nickname,
      password: "kakao",
    }
    return await this.userService.addUser(userData);
  }

  // 토큰을 만들어내느 함수
  async getToken(user){
    const secretKey = process.env.JWT_SECRET_KEY ||'secret-key'
    const token = jwt.sign({ userId: user._id, role: user.role } , secretKey)
    return { token }
  }
}

const kakaoOAuthService = new KakaoOAuthService(userService)

export { kakaoOAuthService }


