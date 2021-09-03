import { Router } from 'express';
import { error, success } from '../../utils/helpers/response';
import Facility from '../../models/Facility';
import ValidateFields from '../../utils/helpers/validateFields';

const router = Router();
const mandatoryFields = [
  'name',
  'address',
  'location',
  'schedule',
  'phoneNumberPrimary',
];

const {
  validateTokenAlive,
  validateExistenceAccessHeader,
  validateSession,
  validateAuth,
} = require('../../middlewares');

//Get all Facilities
router.get(
  '/facilities',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const facilities = await Facility.find({
        deletedAt: { $exists: true, $ne: null },
      });
      return res.json(
        success({
          requestId: req.id,
          data: {
            facilities,
          },
        })
      );
    } catch (err) {
      res.status(500).json(
        error({
          requestId: req.id,
          code: 500,
          message: err.message,
        })
      );
    }
  }
);

//Get a Facility based on id
router.get(
  '/facilities/:id',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const result = await Facility.validateFacility(req.params.id);
      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }
      return res
        .status(200)
        .json(success({ requestId: req.id, data: result.facility }));
    } catch (err) {
      return res.status(500).json(error({ requestId: req.id, code: 500 }));
    }
  }
);

//Add a Facility
router.post(
  '/facilities',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const result = ValidateFields.validateRequiredFields(
        req.body,
        mandatoryFields
      );

      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }

      const addedFacility = await Facility.create({
        ...req.body,
        createdBy: req.user_id,
      });

      return res.json(
        success({ requestId: req.id, data: { facility: addedFacility } })
      );
    } catch (err) {
      return res
        .status(500)
        .json(error({ requestId: req.id, code: 500, message: err.message }));
    }
  }
);

//Update facility
router.patch(
  '/facilities/:id',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const result = ValidateFields.validateRequiredFields(
        req.body,
        mandatoryFields
      );

      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }

      const result2 = await Facility.validateFacility(req.params.id);
      if (result2.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result2.code,
          })
        );
      }

      (req.body.updatedBy = req.user_id),
        Facility.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, omitUndefined: true },
          (err, updatedFacility) => {
            if (err) {
              return res
                .status(500)
                .json(
                  error({ requestId: req.id, code: 500, message: err.message })
                );
            } else if (!updatedFacility) {
              return res.status(404).json(
                error({
                  requestId: req.id,
                  code: 404,
                })
              );
            }
            return res.json(
              success({
                requestId: req.id,
                data: { facility: updatedFacility },
              })
            );
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
  '/facilities/:id',
  [
    validateExistenceAccessHeader,
    validateSession,
    validateTokenAlive,
    validateAuth,
  ],
  async (req, res) => {
    try {
      const result = ValidateFields.validateRequiredFields(
        req.body,
        mandatoryFields
      );

      if (result.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result.code,
          })
        );
      }

      const result2 = await Facility.validateFacility(req.params.id);
      if (result2.code !== 200) {
        return res.status(result.code).json(
          error({
            requestId: req.id,
            code: result2.code,
          })
        );
      }

      req.body.updatedBy = req.user_id;
      req.body.deletedBy = req.user_id;

      Facility.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, omitUndefined: true },
        (err, updatedFacility) => {
          if (err) {
            return res
              .status(500)
              .json(
                error({ requestId: req.id, code: 500, message: err.message })
              );
          } else if (!updatedFacility) {
            return res.status(404).json(
              error({
                requestId: req.id,
                code: 404,
              })
            );
          }
          return res.json(
            success({ requestId: req.id, data: { facility: updatedFacility } })
          );
        }
      );
    } catch (err) {
      return res
        .status(500)
        .json(error({ requestId: req.id, code: 500, message: err.message }));
    }
  }
);

export default router;
