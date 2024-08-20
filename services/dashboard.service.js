const User = require("../models/User");
const InstantOffer = require("../models//Offer");

exports.countAllUsers = async () => {
  try {
    const count = await User.find().countDocuments();
    return count;
  } catch (err) {
    console.log(err);
  }
};

exports.countAllOffers = async () => {
  try {
    const count = await InstantOffer.find().countDocuments();
    return count;
  } catch (err) {
    console.log(err);
  }
};
