const mongoose = require("mongoose");

const attributeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Text", "Number", "Select"],
      required: true,
    },
    defaultValue: {
      type: String,
    },
    options: {
      type: [String],
      default: [],
    },
    isMandatory: {
      type: Boolean,
      default: false, // custom attributes are false by default; mandatory ones will be pre-set to true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attribute", attributeSchema);
