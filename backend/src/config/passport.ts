import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import userController from '../controllers/user.controller.js';
import { UnauthorizedError } from '../config/error.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET не задан в переменных окружения');
}

interface JwtPayload {
  id: number;
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done: VerifiedCallback) => {
    try {
      const user = await userController.getUserByIdWithoutRequest(payload.id);
      if (!user) {
        return done(new UnauthorizedError('Пользователь не найден'), false);
      }
      return done(null, user);
    } catch (error) {
      return done(error as Error, false);
    }
  })
);

export default passport; 