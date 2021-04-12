import { Router } from 'express';
import { success } from './../../utils/response';
const router = Router();

// eslint-disable-next-line require-await
router.get('/zones', async (req, res) =>
  res.status(200).json(success({ requestId: req.id, data: 'TODO' }))
);

// eslint-disable-next-line require-await
router.post('/zones', async (req, res) =>
  res.status(200).json(success({ requestId: req.id, data: 'TODO' }))
);

export default router;
