import { Router } from 'express';
import * as c from '../controllers/workspace.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);
r.get('/', c.list);
r.post('/', c.create);
r.post('/:id/members', c.addMember);
export default r;
