const moment = require("moment");
const Category = require("../models/Category");

exports.addCategory = async (req, res, next) => {
  try {
    const { name, status } = req.body;

    const category = new Category({
      name,
      status,
    });

    await category.save();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    return res.status(200).json({ category });
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
    const logs = await Category.paginate(
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

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    category.isRemoved = true;
    await category.save();

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
    const category = await Category.findById(req.params.id);
    category.status = !category.status;
    const result = await category.save();

    return res.status(201).json({
      message: result.status ? "Category Activated" : "Category Inactivated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, status } = req.body;
    const category = await Category.findById(req.params.id);

    category.name = name;
    category.status = status;
    await category.save();

    return res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getCategoryNames = async (req, res, next) => {
  try {
    const { searchString } = req.query;
    let categories;
    if (searchString) categories = await Category.find({ name: searchString }).sort("-_id").lean();
    else categories = await Category.find().limit(5).sort("-_id").lean();

    return res.status(200).json({ categories });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
