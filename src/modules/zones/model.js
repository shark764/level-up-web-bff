const mongoose = require('mongoose');

const ZonesSchemas = new mongoose.Schema({
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'facilities',
    required: true,
  },

  zoneName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

  dateCreated: {
    type: Number,
    default: Date.now,
    required: false,
  },

  dateUpdated: {
    type: Number,
    default: Date.now,
    required: false,
  },

  userCreated: {
    type: String,
    required: false,
  },

  userUpdated: {
    type: String,
    required: false,
  },
});

const Zones = mongoose.model('Zones', ZonesSchemas);

export default Zones;
