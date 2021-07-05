import { Schema, model } from 'mongoose';

const RolesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  readOnly: {
    type: Boolean,
    required: true,
  },

  permissions: {
    type: [String],
  },

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

const Roles = model('roles', RolesSchema);

export default Roles;
