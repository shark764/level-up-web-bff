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

  equipment: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],

  createdAt: {
    type: Number,
    default: Date.now,
  },

  updatedAt: {
    type: Number,
    default: null,
  },

  deletedAt: {
    type: Number,
    default: null,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },

  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

const Zones = mongoose.model('Zones', ZonesSchemas);

export default Zones;
