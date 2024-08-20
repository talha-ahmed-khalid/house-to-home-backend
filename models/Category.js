const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.plugin(mongoosePaginate);
categorySchema.index({ "$**": "text" });

module.exports = mongoose.model("Category", categorySchema);
