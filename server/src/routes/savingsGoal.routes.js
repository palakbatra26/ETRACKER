import { Router } from 'express';
import * as c from '../controllers/savingsGoal.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { savingsGoalSchema } from '../validators/schemas.js';

const r = Router();
r.use(requireAuth);
r.get('/', c.list);
r.post('/', validate(savingsGoalSchema), c.create);
r.put('/:id', validate(savingsGoalSchema), c.update);
r.delete('/:id', c.remove);

export default r;
