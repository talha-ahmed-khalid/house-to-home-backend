const moment = require("moment");
const Attribute = require("../models/Attribute");

exports.addAttribute = async (req, res, next) => {
  try {
    const { name, value, type } = req.body;

    const attribute = new Attribute({
      name,
      value,
      type,
    });

    await attribute.save();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const attribute = await Attribute.findById(req.params.id).lean();
    return res.status(200).json({ attribute });
  } catch (err) {
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
    const logs = await Attribute.paginate(
      {
        ...searchFilter,
        ...dateFilter,
        isRemoved: false,
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

exports.deleteAttribute = async (req, res, next) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    attribute.isRemoved = true;
    await attribute.save();

    return res.status(200).json({
      message: "Success",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.toggleStatus = async (req, res, next) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    attribute.status = !attribute.status;
    const result = await attribute.save();

    return res.status(201).json({
      message: result.status ? "Attribute Activated" : "Attribute Inactivated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateAttribute = async (req, res, next) => {
  try {
    const { name, type, value } = req.body;
    const attribute = await Attribute.findById(req.params.id);

    attribute.name = name;
    attribute.type = type;
    attribute.value = [...value];
    await attribute.save();

    return res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getAttributeNames = async (req, res, next) => {
  try {
    const { searchString } = req.query;
    let attributes;
    if (searchString) attributes = await Attribute.find({ name: searchString }).sort("-_id").lean();
    else attributes = await Attribute.find().limit(5).sort("-_id").lean();

    return res.status(200).json({ attributes });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
