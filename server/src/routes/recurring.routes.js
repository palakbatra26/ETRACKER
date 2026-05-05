import { Router } from 'express';
import * as c from '../controllers/recurring.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { recurringSchema } from '../validators/schemas.js';

const r = Router();
r.use(requireAuth);
r.get('/', c.list);
r.post('/', validate(recurringSchema), c.create);
r.delete('/:id', c.remove);
export default r;
