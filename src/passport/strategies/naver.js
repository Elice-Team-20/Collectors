import { userService } from '../../services';
import { Strategy as NaverStrategy } from 'passport-naver-v2'
import bcrypt from 'bcrypt';


const config = {
    clientID: process.env.NAVER_ID,
    clientSecret: process.env.NAVER_SECRET,
    callbackURL: 'api/auth/naver/callback'

}


async function findOrCreateUser({email, name}){
    const user = await userService.getUserByEmail(email);
    // 해당 email을 가진 유저가 있는지 검사
    // 있을 경우 해당 유저를 반환
    if (user) {
        return user;
    }
    const hashedPassword = await bcrypt.hash('naver', 10);
    // 없을 경우 생성
    const created = await userService.addUser({
        email: email,
        fullName: name,
        password: 'naver'
    })
    return created;
}

module.exports = new NaverStrategy(config,
    async (accessToken, refreshToken, profile, done) => {
        const { email, name } = profile;
        try{
            const user = await findOrCreateUser({email, name});
            const token = await userService.setUserTokenNaver(user);
            done(null, token);
        }catch(error){
            console.log(error);
            done(error);
        }
    }
);
