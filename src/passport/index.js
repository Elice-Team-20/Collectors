import passport from 'passport';
import naver from './strategies/naver';
import google from './strategies/google';

function initialize() {
    passport.use(naver);
    passport.use(google);
}

export { initialize }