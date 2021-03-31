const mongoose = require("mongoose");

const FacilitiesSchema = new mongoose.Schema({
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
    type: { type: String, default: "Point" },
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
});

const Facilities = mongoose.model("facilities", FacilitiesSchema);

module.exports = Facilities;
