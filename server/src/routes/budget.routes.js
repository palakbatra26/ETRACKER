import { Router } from 'express';
import * as c from '../controllers/budget.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { budgetSchema } from '../validators/schemas.js';

const r = Router();
r.use(requireAuth);
r.get('/current', c.current);
r.put('/', validate(budgetSchema), c.upsert);
export default r;
