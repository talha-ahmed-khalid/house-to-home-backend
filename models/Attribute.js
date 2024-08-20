const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const attributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

attributeSchema.plugin(mongoosePaginate);
attributeSchema.index({ "$**": "text" });

module.exports = mongoose.model("Attribute", attributeSchema);
