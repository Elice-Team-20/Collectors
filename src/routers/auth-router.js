import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));

authRouter.get('/naver/callback', passport.authenticate('naver', {session:false}),
    async (req, res, next) => {
        
        res.status(200).json(req.user.token)
    }
)



export { authRouter };