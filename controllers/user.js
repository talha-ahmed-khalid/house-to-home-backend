const moment = require("moment");
const User = require("../models/User");

const { getFilePath, generateEmail, generateHash, deleteFile, getUserForAuth } = require("../services");
const { userExists, validateEmail, verifyPassword } = require("../validations");

exports.getLogs = async (req, res, next) => {
  try {
    const { searchString, page, perPage, from, to } = req.query;
    const searchFilter = searchString ? { $text: { $search: searchString } } : {};
    let dateFilter = {};
    const _from = from ? from : null;
    const _to = to ? to : null;
    if (_from && _to)
      dateFilter = {
        createdAt: {
          $gte: moment.utc(new Date(_from)).startOf("day").toDate(),
          $lte: moment.utc(new Date(_to)).endOf("day").toDate(),
        },
      };
    const logs = await User.paginate(
      {
        ...searchFilter,
        ...dateFilter,
      },
      {
        page: page,
        limit: perPage,
        lean: true,
        sort: "-_id",
      }
    );

    return res.status(200).json({ logs });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).lean();
    return res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = !user.status;
    const result = await user.save();

    return res.status(201).json({
      message: result.status ? "User Activated" : "User Inactivated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const { name, country, city, zipCode, address, phoneNumber, profileImage } = req.body;
    const newProfileImage = await getFilePath(req.files, "profileImage");

    const user = await User.findById(req.params.id);

    user.name = name;
    user.profileImage = newProfileImage ? newProfileImage : profileImage;
    user.country = country;
    user.city = city;
    user.zipCode = zipCode;
    user.address = address;
    user.phoneNumber = JSON.parse(phoneNumber);
    await user.save();

    return res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    const newProfileImage = await getFilePath(req.files, "profileImage");
    if (newProfileImage) deleteFile(newProfileImage);

    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId).populate("auth");
    if (!user) {
      const error = new Error("Invalid Request");
      error.statusCode = 400;
      throw error;
    }

    const isEqual = await verifyPassword(currentPassword, user.auth.password);
    if (!isEqual) {
      const error = new Error("Your current password is not valid");
      error.statusCode = 400;
      throw error;
    }

    if (currentPassword === newPassword) {
      const error = new Error("Your new password must not be same as your current password!");
      error.statusCode = 406;
      throw error;
    }

    const userAuth = await getUserForAuth(user.auth.email);
    userAuth.password = await generateHash(newPassword);

    await userAuth.save();

    return res.status(200).json({ message: "Your password has been updated" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
