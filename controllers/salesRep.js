const moment = require("moment");
const Auth = require("../models/Auth");
const SalesRep = require("../models/SalesRep");

const { getFilePath, generateEmail, generateHash, deleteFile } = require("../services");
const { userExists, validateEmail } = require("../validations");

exports.addSalesRep = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email: _email,
      password,
      country,
      city,
      zipCode,
      address,
      phoneNumber,
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

    const salesRep = new SalesRep({
      firstName,
      lastName,
      email,
      profileImage: profileImage ? profileImage : null,
      country,
      city,
      zipCode,
      address,
      phoneNumber,
      auth: auth._id,
    });

    auth.user = salesRep._id;
    await salesRep.save();
    await auth.save();

    const html = `
    <div>
        <p>
            Congratulations ${firstName} ${lastName}, your account has been registered on our platform. You can use following credentials to access your account.
        </p>
        <p>
            <strong>Email: </strong> ${email}
        </p>
        <p>
            <strong>Password: </strong> ${password}
        </p>
        <p>If you did not request this, please contact Admin Support.</p>
    </div>
    `;
    await generateEmail(email, "House to Home - Congratulations! Your Account has been registered.", html);

    return res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    const profileImage = await getFilePath(req.files, "profileImage");
    if (profileImage) deleteFile(profileImage);

    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.editSalesRep = async (req, res, next) => {
  try {
    const { firstName, lastName, country, city, zipCode, address, phoneNumber, profileImage } = req.body;
    const newProfileImage = await getFilePath(req.files, "profileImage");

    const salesRep = await SalesRep.findById(req.params.id);

    salesRep.firstName = firstName;
    salesRep.lastName = lastName;
    salesRep.profileImage = newProfileImage ? newProfileImage : profileImage;
    salesRep.country = country;
    salesRep.city = city;
    salesRep.zipCode = zipCode;
    salesRep.address = address;
    salesRep.phoneNumber = JSON.parse(phoneNumber);
    await salesRep.save();

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
    const logs = await SalesRep.paginate(
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
    const salesRep = await SalesRep.findById(req.params.id).lean();
    return res.status(200).json({ salesRep });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const salesRep = await SalesRep.findById(req.params.id);
    salesRep.status = !salesRep.status;
    const result = await salesRep.save();

    return res.status(201).json({
      message: result.status ? "User Activated" : "User Inactivated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
