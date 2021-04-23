import { Schema, model } from 'mongoose';

const PermissionsSchema = new Schema({
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
  deletedAt: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Permissions = model('Permissions', PermissionsSchema);

export default Permissions;
