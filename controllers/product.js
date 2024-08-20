const moment = require("moment");
const Product = require("../models/Product");

const { getFilePath, deleteFile } = require("../services");

exports.addProduct = async (req, res, next) => {
  try {
    const {
      name,
      type,
      description,
      userGuide,
      category,
      attributes,
      price,
      stock,
      availableOnInstallments,
    } = req.body;
    const mainImage = await getFilePath(req.files, "mainImage");
    const images = req.files && req.files.images.length > 0 && req.files.images.map((el) => (el = el.path));

    const product = new Product({
      name,
      type,
      description,
      userGuide,
      category,
      attributes,
      mainImage,
      images,
      availableOnInstallments,
    });

    if (price) product.price = price;
    if (stock) product.stock = stock;

    await product.save();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    const profileImage = await getFilePath(req.files, "profileImage");
    if (profileImage) deleteFile(profileImage);

    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category attributes").lean();
    return res.status(200).json({ product });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getLogs = async (req, res, next) => {
  try {
    const { searchString, page, perPage, from, to, type } = req.query;
    const typeFilter = type ? { type } : {};
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
    const logs = await Product.paginate(
      {
        ...searchFilter,
        ...dateFilter,
        ...typeFilter,
        isRemoved: false,
      },
      {
        page: page,
        limit: perPage,
        lean: true,
        sort: "-_id",
        populate: {
          path: "category",
          select: "name",
        },
      }
    );

    return res.status(200).json({ logs });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    product.isRemoved = true;
    await product.save();

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
    const product = await Product.findById(req.params.id);
    product.status = !product.status;
    const result = await product.save();

    return res.status(201).json({
      message: result.status ? "Product Activated" : "Product Inactivated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      type,
      description,
      userGuide,
      category,
      attributes,
      mainImage,
      images,
      price,
      stock,
      availableOnInstallments,
    } = req.body;
    const product = await Product.findById(req.params.id);

    product.name = name;
    product.type = type;
    product.description = description;
    product.userGuide = userGuide;
    product.category = category;
    product.attributes = attributes;
    product.mainImage = mainImage;
    product.images = images;
    product.price = price;
    product.stock = stock;
    product.availableOnInstallments = availableOnInstallments;
    await product.save();

    return res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
