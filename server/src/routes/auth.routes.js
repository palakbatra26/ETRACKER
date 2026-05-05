import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const r = Router();
r.post('/register', validate(registerSchema), c.register);
r.post('/login', validate(loginSchema), c.login);
r.post('/refresh', c.refresh);
r.post('/logout', c.logout);
r.get('/me', requireAuth, c.me);
export default r;
