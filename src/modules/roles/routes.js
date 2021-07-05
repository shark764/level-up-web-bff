import { Router } from 'express';
import { isMongoId } from 'validator';
import { error, success } from '../../utils/helpers/response';
import Roles from './model';

const router = Router();
const {
  validateTokenAlive,
  validateExistenceAccessHeader,
  validateSession,
  validateAuth,
} = require('../../middlewares');

//Get all Roles
router.get('/',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const roles = await Roles.find({ deletedAt: null });
      return res.json(
        success({
          requestId: req.id,
          data: {
            roles,
          },
        })
      );
    } catch (err) {
      res.status(500).json({requestId: req.id, code: 500,message: e.message});
    }
  }
);

//Get a Role based on id
router.get(
  '/:id',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      if (!isMongoId(req.params.id))
        return res.status(400).json(error({ requestId: req.id, code: 400 }));

      const role = await Roles.findById(req.params.id);
      if (!role)
        return res.status(404).json(error({ requestId: req.id, code: 404 }));

      return res.json(success({ requestId: req.id, data: { role } }));
    } catch (err) {
      return res.status(500).json(error({ requestId: req.id, code: 500, message:err.message }));
    }
  }
);

//Add a Role
router.post('/',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const result = validateRequiredFields(req, [
        'name',
        'description',
        'readOnly',
        'permissions',
        'createdBy',
      ]);

      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }

      if (req.user.role !== 'SUPERADMIN') {
        return res.status(403).json(
          error({
            requestId: req.id,
            code: 403,
          })
        );
      }

      const { name, description, readOnly, permissions } = req.body;

      const addedRole = await Roles.create({
        name,
        description,
        readOnly,
        permissions,
      });

      return res.json(success({ requestId: req.id, data: { addedRole } }));
    } catch (err) {
      return res
        .status(500)
        .json(error({ requestId: req.id, code: 500, message: err.message }));
    }
  }
);

//Update role
router.patch(
  '/:id',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const validationResult = await validateRole(req.params.id);

      if (validationResult.code !== 200) {
        return res.status(validationResult.code).json(
          error({
            requestId: req.id,
            code: validationResult.code,
          })
        );
      }

      const result = validateRequiredFields(req, [
        'name',
        'description',
        'readOnly',
        'permissions',
        'updatedBy',
      ]);

      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }

      if (req.user.role !== 'SUPERADMIN') {
        return res.status(403).json(
          error({
            requestId: req.id,
            code: 403,
          })
        );
      }

      req.body.updatedAt = Date.now();

      Roles.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, omitUndefined: true },
        (err, updatedRole) => {
          if (err) {
            return res
              .status(500)
              .json(
                error({ requestId: req.id, code: 500, message: err.message })
              );
          } else if (!updatedRole) {
            return res.status(404).json(
              error({
                requestId: req.id,
                code: 404,
              })
            );
          } 
        }
      );
    } catch (err) {
      return res
        .status(500)
        .json(error({ requestId: req.id, code: 500, message: err.message }));
    }
  }
);

router.delete(
  '/:id',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const validationResult = await validateRole(req.params.id);

      if (validationResult.code !== 200) {
        return res.status(validationResult.code).json(
          error({
            requestId: req.id,
            code: validationResult.code,
          })
        );
      }

      if (req.user.role !== 'SUPERADMIN') {
        return res.status(403).json(
          error({
            requestId: req.id,
            code: 403,
          })
        );
      }

      const result = validateRequiredFields(req, ['deletedBy']);

      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }

      req.body.deletedAt = Date.now();

      Roles.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, omitUndefined: true },
        (err, updatedRole) => {
          if (err) {
            return res
              .status(500)
              .json(
                error({ requestId: req.id, code: 500, message: err.message })
              );
          } else if (!updatedRole) {
            return res.status(404).json(
              error({
                requestId: req.id,
                code: 404,
              })
            );
          }
        }
      );
    } catch (err) {
      return res.status(500).json(error({ requestId: req.id, code: 500, message: err.message }));
    }
  }
);

function validateRequiredFields(req, fields) {
  const result = {
    code: 200,
  };

  const updates = Object.keys(req.body);
  const mandatoryFields = fields;

  for (const mandatoryField of mandatoryFields) {
    if (!updates.includes(mandatoryField) || !req.body[mandatoryField] ) {
      result.code = 400;
    } 
  }
  return result;
}

async function validateRole(RoleId) {
  try {
    const result = {
      code: 200,
    };

    if (!isMongoId(RoleId)) result.code = 400;

    const role = await Roles.findById(RoleId);

    if (!role || role.deletedAt) {
      result.code = 404;
    }

    return result;
  } catch (err) {
    throw err;
  }
}

export default router;
