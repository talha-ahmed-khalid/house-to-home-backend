const Auth = require("../models/Auth");
const Admin = require("../models/Admin");
const User = require("../models/User");

const { generateCode } = require("../helpers");
const { userExists, validateEmail, comparePassword, verifyPassword } = require("../validations");
const {
  getFilePath,
  deleteFile,
  generateEmail,
  generateHash,
  generateToken,
  createPasswordResetToken,
  getUserForAuth,
  comparePasswordResetToken,
} = require("../services");

// @ADMIN APIs

exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email: _email, password } = req.body;

    const profileImage = await getFilePath(req.files, "profileImage");
    const email = validateEmail(_email);

    if (!email) throw new Error("Invalid Email Address");
    if (await userExists(email)) {
      const error = new Error("Email Already Exist");
      error.statusCode = 409;
      throw error;
    }

    const auth = new Auth({
      email,
      password: await generateHash(password),
    });

    const admin = new Admin({
      name,
      profileImage: profileImage ? profileImage : null,
      auth: auth._id,
    });

    auth.user = admin._id;
    await admin.save();
    await auth.save();

    return res.status(201).json({
      message: "Admin Registered",
    });
  } catch (err) {
    const profileImage = await getFilePath(req.files, "profileImage");
    if (profileImage) deleteFile(profileImage);

    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await getUserForAuth(email);
    if (!admin) {
      const error = new Error("Invalid Email Address");
      error.statusCode = 400;
      throw error;
    }

    const isEqual = await verifyPassword(password, admin.password);
    if (!isEqual) {
      const error = new Error("Invalid Password");
      error.statusCode = 400;
      throw error;
    }

    const token = await generateToken(admin.email, admin.adminAuth._id, process.env.JWT_SECRET, {
      isAdmin: true,
    });

    return res.status(200).json({
      message: "Success",
      token,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId).populate("auth", "email").lean();
    return res.status(200).json({ admin });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// @USER APIs
exports.registerUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email: _email,
      password,
      phoneNumber,
      address,
      city,
      zipCode,
      country,
    } = req.body;

    const profileImage = await getFilePath(req.files, "profileImage");
    const email = validateEmail(_email);

    if (!email) throw new Error("Invalid Email Address");
    if (await userExists(email)) {
      const error = new Error("Email Already Exist");
      error.statusCode = 409;
      throw error;
    }

    const auth = new Auth({
      email,
      password: await generateHash(password),
    });

    const user = new User({
      firstName,
      lastName,
      profileImage: profileImage ? profileImage : null,
      email,
      phoneNumber,
      address,
      city,
      zipCode,
      country,
      auth: auth._id,
    });

    auth.user = user._id;
    await user.save();
    await auth.save();

    return res.status(201).json({
      message: "User Registered",
    });
  } catch (err) {
    const profileImage = await getFilePath(req.files, "profileImage");
    if (profileImage) deleteFile(profileImage);

    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserForAuth(email);
    if (!user) {
      const error = new Error("Invalid Email Address");
      error.statusCode = 400;
      throw error;
    }

    const isEqual = await verifyPassword(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid Password");
      error.statusCode = 400;
      throw error;
    }

    const token = await generateToken(user.email, user.userAuth._id, process.env.JWT_SECRET, {
      isUser: true,
    });

    return res.status(200).json({
      message: "Success",
      token,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("auth", "email");
    return res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.recoverPassword = async (req, res, next) => {
  try {
    const { email: _email } = req.body;

    const email = validateEmail(_email);
    if (!email) {
      const error = new Error("Invalid Email Address");
      error.statusCode = 400;
      throw error;
    }

    const user = await getUserForAuth(email);
    if (!user) {
      const error = new Error("Invalid Email Address");
      error.statusCode = 400;
      throw error;
    }

    const passwordResetCode = generateCode();
    await createPasswordResetToken(email, passwordResetCode);
    const html = `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
    \n\n Your verification code is ${passwordResetCode}:\n\n
    \n\n If you did not request this, please ignore this email and your password will remain unchanged.
    </p>`;
    await generateEmail(email, "Black Horse - Password Reset", html);

    return res.status(201).json({
      message: "Recovery Code Has Been Emailed To Your Registered Email Address",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.verifyRecoverCode = async (req, res, next) => {
  try {
    const { code, email: _email } = req.body;

    const email = validateEmail(_email);
    if (!email) {
      const error = new Error("Invalid Email Address");
      error.statusCode = 400;
      throw error;
    }

    const isValidCode = await comparePasswordResetToken(code, email);
    if (!isValidCode) {
      const error = new Error("Invalid Recovery Code");
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword, code, email: _email } = req.body;

    const email = validateEmail(_email);
    if (!email) {
      const error = new Error("Invalid Email Address");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordEqaul = await comparePassword(password, confirmPassword);
    if (!isPasswordEqaul) {
      const error = new Error("Password does not match");
      error.statusCode = 400;
      throw error;
    }

    const isValidCode = await comparePasswordResetToken(code, email);
    if (!isValidCode) {
      const error = new Error("Invalid Recovery Code");
      error.statusCode = 400;
      throw error;
    }

    const userAuth = await getUserForAuth(email);
    userAuth.password = await generateHash(password);
    await userAuth.save();

    return res.status(201).json({
      message: "Your Password Has Been Updated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
