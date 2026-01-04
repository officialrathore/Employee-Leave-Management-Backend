import express from 'express';
import passport from 'passport';
import { loginUser, signupUser,updatePassword, googleAuthCallback} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup', signupUser);
authRouter.post('/login', loginUser);
authRouter.post('/update-password',updatePassword);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL_LOCAL||process.env.CLIENT_URL}/login` }), googleAuthCallback);

export default authRouter;