import passport from 'passport';
import naver from './strategies/naver';

function initialize() {
    passport.use(naver);
}

export { initialize }