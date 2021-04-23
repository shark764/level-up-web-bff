import { Router } from 'express';
import { error, success } from './../../utils/response';
import Zones from './model';
import Facilities from '../facilities/model';

const router = Router();

//get all zones
router.get('/zones', async (req, res) => {
  try {
    const zones = await Zones.find().populate('facilityId');
    return res
      .status(200)
      .json(success({ requestId: req.id, data: { zones } }));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
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
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

//create new zone
router.post('/zones', async (req, res) => {
  try {
    const facility = await Facilities.findById(req.body.facilityId);

    if (!req.body.userCreated) {
      return res.status(404).json(
        error({
          requestId: req.id,
          code: 404,
          message: 'create user (userCreated) is required',
        })
      );
    }

    if (facility) {
      const zone = await Zones.create({
        facilityId: facility,
        zoneName: req.body.zoneName,
        description: req.body.description,
        status: req.body.status,
        userCreated: req.body.userCreated,
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
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

//update zone
router.patch('/zones/:id', async (req, res) => {
  try {
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
      }
    }

    if (!req.body.userUpdated) {
      return res.status(404).json(
        error({
          requestId: req.id,
          code: 404,
          message: 'update user (userUpdated) is required',
        })
      );
    }

    req.body.dateUpdated = Date.now();

    Zones.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, omitUndefined: true },
      (err, updatedZone) => {
        if (err) {
          return res
            .status(500)
            .json(error({ requestId: req.id, code: 500, message: err }));
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
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

//delete zone
router.delete('/zones/:id', (req, res) => {
  try {
    Zones.findByIdAndDelete(req.params.id, req.body, (err, deletedZone) => {
      if (err) {
        return res
          .status(500)
          .json(error({ requestId: req.id, code: 500, message: err }));
      } else if (!deletedZone) {
        return res
          .status(404)
          .json(
            error({ requestId: req.id, code: 404, message: 'Zone not found' })
          );
      } else {
        return res
          .status(200)
          .json(success({ requestId: req.id, data: { zone: deletedZone } }));
      }
    }).populate('facilityId');
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(error({ requestId: req.id, code: 500, message: err }));
  }
});

router.all('/zones', (req, res) =>
  res
    .status(405)
    .json(
      error({ requestId: req.id, code: 405, message: 'Method not allowed' })
    )
);

export default router;
