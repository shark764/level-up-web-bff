import { Router } from 'express';
import { error, success } from './../../utils/response';
import Facilities from './model';
const router = Router();

//Get all Facilities
router.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facilities.where('deletedAt').eq(null);
    return res.status(200).json(
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
});

//Get a Facility based on id
router.get('/facilities/:id', async (req, res) => {
  try {
    const facility = await Facilities.findById(req.params.id);
    if (!facility)
      return res
        .status(404)
        .json(error({ requestId: req.id, code: 404, message: 'Not Found' }));

    res.json(facility);
  } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

//Add a Facility
router.post('/facilities', async (req, res) => {
  try {
    const result = validateRequiredFields(req, [
      'name',
      'description',
      'address',
      'schedule',
      'createdBy',
    ]);

    if (result.code !== 200) {
      return res.status(result.code).json(
        error({
          requestId: req.id,
          code: result.code,
          message: result.message,
        })
      );
    }

    const addedFacility = await Facilities.create({
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      location: req.body.location,
      schedule: req.body.schedule,
      phoneNumber: req.body.phoneNumber,
      pictures: req.body.pictures,
      amenities: req.body.amenities,
    });

    return res
      .status(200)
      .json(success({ requestId: req.id, data: { addedFacility } }));
  } catch (err) {
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

//Update facility
router.patch('/facilities/:id', async (req, res) => {
  try {
    const validationResult = await validateFacility(req.params.id);

    if (validationResult.code !== 200) {
      return res.status(validationResult.code).json(
        error({
          requestId: req.id,
          code: validationResult.code,
          message: validationResult.message,
        })
      );
    }

    const result = validateRequiredFields(req, [
      'name',
      'description',
      'address',
      'schedule',
      'updatedBy',
    ]);

    if (result.code !== 200) {
      return res.status(result.code).json(
        error({
          requestId: req.id,
          code: result.code,
          message: result.message,
        })
      );
    }

    req.body.updatedAt = Date.now();

    Facilities.findByIdAndUpdate(
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
              message: 'Facility not found',
            })
          );
        } else {
          return res.status(200).json(
            success({
              requestId: req.id,
              data: { facility: updatedFacility },
            })
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

router.delete('/facilities/:id', async (req, res) => {
  try {
    const validationResult = await validateFacility(req.params.id);

    if (validationResult.code !== 200) {
      return res.status(validationResult.code).json(
        error({
          requestId: req.id,
          code: validationResult.code,
          message: validationResult.message,
        })
      );
    }

    const result = validateRequiredFields(req, ['deletedBy']);

    if (result.code !== 200) {
      return res.status(result.code).json(
        error({
          requestId: req.id,
          code: result.code,
          message: result.message,
        })
      );
    }

    req.body.deletedAt = Date.now();

    Facilities.findByIdAndUpdate(
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
              message: 'Facility not found',
            })
          );
        } else {
          return res.status(200).json(
            success({
              requestId: req.id,
              data: { facility: updatedFacility },
            })
          );
        }
      }
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

router.all('/facilities', (req, res) =>
  res
    .status(405)
    .json(
      error({ requestId: req.id, code: 405, message: 'Method not allowed' })
    )
);

function validateRequiredFields(req, fields) {
  let result = {
    code: 200,
    message: '',
  };

  const updates = Object.keys(req.body);
  const mandatoryFields = fields;
  const messageE = 'Missing required field: ';

  for (const mandatoryField of mandatoryFields) {
    if (!updates.includes(mandatoryField)) {
      result = {
        code: 400,
        message: messageE.concat(mandatoryField),
      };
    } else if (!req.body[mandatoryField]) {
      result = {
        code: 400,
        message: messageE.concat(mandatoryField),
      };
    }
  }
  return result;
}

async function validateFacility(FacilityId) {
  try {
    const facility = await Facilities.findById(FacilityId);

    let result = {
      code: 200,
      message: '',
    };

    if (!facility) {
      result = {
        code: 404,
        message: 'Facility not found',
      };
    } else if (facility.deletedAt) {
      result = {
        code: 400,
        message: 'Facility is unavailable, it was removed',
      };
    } else {
      result = {
        code: 200,
        message: 'Facility found',
      };
    }

    return result;
  } catch (err) {
    console.error(err);
  }
}

export default router;
