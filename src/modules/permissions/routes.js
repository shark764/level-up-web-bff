import { Router } from 'express';
import { error, success } from './../../utils/response';
import Permissions from './model';

const router = Router();

router.get('/permissions', async (req, res) => {
  try {
    const permissions = await Permissions.find();
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { permissions } }));
  } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

router.post('/permissions', async (req, res) => {
  try {
    const permission = await Permissions.create({
      name: req.body.name,
      description: req.body.description,
      readOnly: req.body.readOnly,
    });
    // Todo: Check mandatory fields
    // Todo: Validations
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { permission } }));
  } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

// Routes that fetch a Permission object by Id

router.all('/permissions/:id', async (req, res, next) => {
  try {
    const permission = await Permissions.findById(req.params.id);
    if (!permission) {
      return res
        .status(404)
        .json(error({ requestId: req.id, code: 404, message: 'Not Found' }));
    }
    req.permission = permission;
    next();
  } catch (err) {
    console.error('err', err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

router.get('/permissions/:id', (req, res) =>
  res
    .status(200)
    .json(success({ requestId: req.id, data: { permission: req.permission } }))
);

router.patch('/permissions/:id', async (req, res) => {
  try {
    const { permission } = req;
    ['name', 'description'].forEach((item) => {
      if (item in req.body) {
        permission[item] = req.body[item];
      }
    });
    // Todo: Validations
    permission.dateUpdated = Date.now();
    await permission.save();
    return res
      .status(200)
      .json(
        success({ requestId: req.id, data: { permission: req.permission } })
      );
  } catch (err) {
    console.error('err', err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

router.delete('/permissions/:id', async (req, res) => {
  try {
    const { permission } = req;
    permission.deletedAt = Date.now();
    await permission.save();
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { permission } }));
  } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

router.all('/permissions', (req, res) =>
  res
    .status(405)
    .json(
      error({ requestId: req.id, code: 405, message: 'Method not allowed' })
    )
);

export default router;
