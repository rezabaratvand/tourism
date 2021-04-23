import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  expiresIn: process.env.JWT_EXPIRATION || '1d',
  secret: process.env.JWT_SECRET,
}));
