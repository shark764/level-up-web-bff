import { Router } from 'express';
import { error, success } from './../../utils/response';
import Facilities from './model';
const router = Router();

//Get all Facilities
router.get('/facilities', async (req, res) => {
  try {
    const facilities = await Facilities.find();
    return res.status(200).json(
      success({
        requestId: req.id,
        data: {
          facilities,
        },
      })
    );
  } catch (error) {
    res.status(500).json(
      error({
        requestId: req.id,
        code: 500,
        message: error,
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
      .json(error({ requestId: req.id, code: 500, message: err }));
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
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

//Update facility
router.patch('/facilities/:id', (req, res) => {
  try {
    const result = validateRequiredFields(req, [
      'name',
      'description',
      'address',
      'schedule',
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

    Facilities.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, omitUndefined: true },
      (err, updatedFacility) => {
        if (err) {
          return res
            .status(500)
            .json(error({ requestId: req.id, code: 500, message: err }));
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
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

router.delete('/facilities/:id', (req, res) => {
  try {
    Facilities.findByIdAndDelete(req.params.id, (err, deletedFacility) => {
      if (err) {
        return res
          .status(500)
          .json(error({ requestId: req.id, code: 500, message: err }));
      } else if (!deletedFacility) {
        return res.status(404).json(
          error({
            requestId: req.id,
            code: 404,
            message: 'Facility not found',
          })
        );
      } else {
        return res
          .status(200)
          .json(
            success({ requestId: req.id, data: { facility: deletedFacility } })
          );
      }
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
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

  if (
    !req.body.location.coordinates ||
    req.body.location.coordinates.length === 0
  ) {
    result = {
      code: 400,
      message: 'Coordinates are required',
    };
  }

  const updates = Object.keys(req.body);
  const updatesValues = Object.values(req.body);
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

export default router;
