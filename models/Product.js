const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      default: 0 /* type=0 for stock prod & type=1 for appointment type products  */,
    },
    description: {
      type: String,
      required: true,
    },
    userGuide: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    attributes: {
      type: Schema.Types.ObjectId,
      ref: "Attribute",
      required: false,
    },
    mainImage: {
      type: String,
      required: false,
    },
    images: {
      type: Array,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    stock: {
      type: Number,
      required: false,
    },
    availableOnInstallments: {
      type: Boolean,
      default: false,
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

productSchema.plugin(mongoosePaginate);
productSchema.index({ "$**": "text" });

module.exports = mongoose.model("Product", productSchema);
