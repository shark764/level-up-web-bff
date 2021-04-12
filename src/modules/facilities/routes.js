import { Router } from 'express';
import { error, success } from './../../utils/response';
import Facilities from './model';
const router = Router();

router.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facilities.find();
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { facilities } }));
  } catch (err) {
    res.status(500).json(error({ requestId: req.id, code: 500, message: err }));
  }
});

// eslint-disable-next-line require-await
router.post('/facilities', async (req, res) =>
  res.status(200).json(success({ requestId: req.id, data: 'TODO' }))
);

export default router;
