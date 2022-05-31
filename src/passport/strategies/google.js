import { userService } from '../../services';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

const config = {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRETKEY,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
}

async function findOrCreateUser({name, email}) {
    const user = await userService.getUserByEmail(email);
    console.log(user)

    // 해당 email을 가진 유저가 있는지 검사
    // 있을 경우 해당 유저를 반환
    if (user) {
        return user;
    }
    // 없을 경우 생성
    const created = await userService.addUser({
        email: email,
        fullName: name,
        password: 'google'
    })
    return created;
}

module.exports = new GoogleStrategy(config,
    async (accessToken, refreshToken, profile, done) => {
        const { email, displayName } = profile;
        console.log(email, displayName)
        try{
            const user = await findOrCreateUser({email, displayName});
            const token = await userService.setUserTokenNaver(user);
            console.log(token)
            done(null, token);
        }catch(error){
            console.log(error);
            done(error);
        }
    }
);