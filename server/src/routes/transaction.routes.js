import { Router } from 'express';
import * as c from '../controllers/transaction.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { transactionSchema } from '../validators/schemas.js';

const r = Router();
r.use(requireAuth);
r.get('/', c.list);
r.post('/', validate(transactionSchema), c.create);
r.put('/:id', validate(transactionSchema), c.update);
r.delete('/:id', c.remove);
r.get('/summary', c.summary);
r.get('/insights', c.insights);
r.get('/charts', c.charts);
export default r;
