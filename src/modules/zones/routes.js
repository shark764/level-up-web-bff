import { Router } from 'express';
import { error, success } from './../../utils/response';
import Zones from './model';
import Facilities from '../facilities/model';

const router = Router();

//get all zones
router.get('/zones', async (req, res) => {
  try {
    const zones = await Zones.where('deletedAt')
      .eq(null)
      .populate('facilityId');
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { zones } }));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

//get zone by id
router.get('/zones/:id', async (req, res) => {
  try {
    const zone = await Zones.findById(req.params.id).populate('facilityId');
    if (!zone) {
      return res
        .status(404)
        .json(
          error({ requestId: req.id, code: 404, message: 'Zone not found' })
        );
    } else {
      return res
        .status(200)
        .json(success({ requestId: req.id, data: { zone } }));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

//create new zone
router.post('/zones', async (req, res) => {
  try {
    const facility = await Facilities.findById(req.body.facilityId);

    if (!req.body.createdBy) {
      return res.status(400).json(
        error({
          requestId: req.id,
          code: 400,
          message: 'Create user (createdBy) is required',
        })
      );
    }

    if (facility) {
      if (facility.deletedAt) {
        return res.status(500).json(
          error({
            requestId: req.id,
            code: 500,
            message: 'Facility is unavailable, it was removed',
          })
        );
      }

      const zone = await Zones.create({
        facilityId: facility,
        zoneName: req.body.zoneName,
        description: req.body.description,
        status: req.body.status,
        equipment: req.body.equipment,
        createdBy: req.body.createdBy,
      });
      return res
        .status(200)
        .json(success({ requestId: req.id, data: { zone } }));
    } else {
      return res
        .status(404)
        .json(
          error({ requestId: req.id, code: 404, message: 'Facility not found' })
        );
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

//update zone
router.patch('/zones/:id', async (req, res) => {
  try {
    const result = await validateZone(req.params.id);

    if (result.code !== 200) {
      return res.status(result.code).json(
        error({
          requestId: req.id,
          code: result.code,
          message: result.message,
        })
      );
    }

    if (req.body.facilityId && !req.body.facilityId._id) {
      req.body.facilityId = await Facilities.findById(req.body.facilityId);
      if (!req.body.facilityId) {
        return res.status(404).json(
          error({
            requestId: req.id,
            code: 404,
            message: 'Facility not found',
          })
        );
      } else if (req.body.facilityId.deletedAt) {
        return res.status(500).json(
          error({
            requestId: req.id,
            code: 500,
            message: 'Facility is unavailable, it was removed',
          })
        );
      }
    }

    if (!req.body.updatedBy) {
      return res.status(400).json(
        error({
          requestId: req.id,
          code: 400,
          message: 'Update user (updatedBy) is required',
        })
      );
    }

    req.body.updatedAt = Date.now();

    Zones.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, omitUndefined: true, runValidators: true },
      (err, updatedZone) => {
        if (err) {
          return res
            .status(500)
            .json(
              error({ requestId: req.id, code: 500, message: err.message })
            );
        } else if (!updatedZone) {
          return res.status(404).json(
            error({
              requestId: req.id,
              code: 404,
              message: 'Zone not found',
            })
          );
        } else {
          return res
            .status(200)
            .json(success({ requestId: req.id, data: { zone: updatedZone } }));
        }
      }
    ).populate('facilityId');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

//delete zone
router.delete('/zones/:id', async (req, res) => {
  try {
    const result = await validateZone(req.params.id);

    if (result.code !== 200) {
      return res.status(result.code).json(
        error({
          requestId: req.id,
          code: result.code,
          message: result.message,
        })
      );
    }

    if (!req.body.deletedBy) {
      return res.status(400).json(
        error({
          requestId: req.id,
          code: 400,
          message: 'Delete user (deletedBy) is required',
        })
      );
    }

    req.body.deletedAt = Date.now();
    req.body.status = 'Deleted';

    Zones.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, omitUndefined: true },
      (err, deletedZone) => {
        if (err) {
          return res
            .status(500)
            .json(
              error({ requestId: req.id, code: 500, message: err.message })
            );
        } else if (!deletedZone) {
          return res.status(404).json(
            error({
              requestId: req.id,
              code: 404,
              message: 'Zone not found',
            })
          );
        } else {
          return res
            .status(200)
            .json(success({ requestId: req.id, data: { zone: deletedZone } }));
        }
      }
    ).populate('facilityId');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err.message }));
  }
});

router.all('/zones', (req, res) =>
  res
    .status(405)
    .json(
      error({ requestId: req.id, code: 405, message: 'Method not allowed' })
    )
);

async function validateZone(ZoneId) {
  try {
    const zone = await Zones.findById(ZoneId);

    let result = {
      code: 200,
      message: '',
    };

    if (!zone) {
      result = {
        code: 404,
        message: 'Zone not found',
      };
    } else if (zone.deletedAt) {
      result = {
        code: 400,
        message: 'Zone is unavailable, it was removed',
      };
    } else {
      result = {
        code: 200,
        message: 'Zone found',
      };
    }

    return result;
  } catch (err) {
    console.error(err);
  }
}

export default router;
