const Admin = require("../models/Admin");
const Auth = require("../models/Auth");
const { deleteFile, getUserForAuth, generateHash } = require("../services");
const { verifyPassword } = require("../validations");

exports.me = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId).populate("auth", "email").lean();
    return res.status(200).json({ admin });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const { name, profileImage } = req.body;
    let newProfileImage;
    newProfileImage =
      req.files && req.files.profileImage && req.files.profileImage[0] && req.files.profileImage[0].path;

    console.log(req.body, newProfileImage);

    const admin = await Admin.findById(req.userId).populate("auth", "email");

    if (newProfileImage) deleteFile(admin.profileImage);

    admin.name = name;
    admin.profileImage = newProfileImage ? newProfileImage : profileImage ? profileImage : null;
    await admin.save();

    return res.status(201).json({
      message: "Profile Updated",
      admin,
    });
  } catch (err) {
    let newProfileImage =
      req.files && req.files.profileImage && req.files.profileImage[0] && req.files.profileImage[0].path;
    if (newProfileImage) deleteFile(newProfileImage);

    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.userId).populate("auth");
    if (!admin) {
      const error = new Error("Invalid Request");
      error.statusCode = 400;
      throw error;
    }
    const isEqual = await verifyPassword(currentPassword, admin.auth.password);
    if (!isEqual) {
      const error = new Error("Your current password is not valid");
      error.statusCode = 400;
      throw error;
    }

    const user = await getUserForAuth(admin.auth.email);
    user.password = await generateHash(newPassword);
    await user.save();

    return res.status(200).json({ message: "Your password has been updated" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
