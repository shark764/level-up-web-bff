import { Schema, model } from 'mongoose';

const FacilitiesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  location: {
    type: { type: String, default: 'Point' },
    coordinates: [{ type: Number, required: true }],
  },

  schedule: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
  },

  pictures: [
    {
      image: {
        type: String,
      },

      comment: {
        type: String,
      },
    },
  ],

  amenities: [{ type: String }],

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
    type: Schema.Types.ObjectId,
    ref: 'users',
  },

  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },

  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

const Facilities = model('facilities', FacilitiesSchema);

export default Facilities;
