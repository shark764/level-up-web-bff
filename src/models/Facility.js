import { isMongoId } from 'validator';
const mongoose = require('mongoose');
const facilitySchema = require('./schemas/Facility');

facilitySchema.statics.validateFacility = async (FacilityId) => {
  const result = {
    code: 200,
    message: '',
  };

  if (!isMongoId(FacilityId)) {
    result.code = 400;
    return result;
  }

  const facility = await Facility.findById(FacilityId);

  if (!facility || facility.deletedAt) {
    result.code = 404;
  }

  result.facility = facility;

  return result;
};

const Facility = mongoose.model('facilities', facilitySchema);
module.exports = Facility;
