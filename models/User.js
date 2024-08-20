const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
      get: (profileImage) => {
        return `${process.env.BASE_URL}${profileImage}`;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      countryCode: String,
      dialCode: String,
      number: String,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    auth: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

userSchema.plugin(mongoosePaginate);
userSchema.index({ "$**": "text" });

module.exports = mongoose.model("User", userSchema);
