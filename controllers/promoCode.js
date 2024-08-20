const moment = require("moment");
const PromoCode = require("../models/PromoCode");

exports.addPromoCode = async (req, res, next) => {
  try {
    const { name, code, description, discount, discountAmount, startingDate, expiryDate } = req.body;

    const promoCode = new PromoCode({
      name,
      code,
      description,
      discount,
      discountAmount,
      startingDate,
      expiryDate,
    });

    await promoCode.save();
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id).lean();
    return res.status(200).json({ promoCode });
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
    const logs = await PromoCode.paginate(
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

exports.deletePromoCode = async (req, res, next) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    promoCode.isRemoved = true;
    await promoCode.save();

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
    const promoCode = await PromoCode.findById(req.params.id);
    promoCode.status = !promoCode.status;
    const result = await promoCode.save();

    return res.status(200).json({
      message: result.status ? "Promo Code Activated" : "Promo Code Inactivated",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.updatePromoCode = async (req, res, next) => {
  try {
    const { name, code, description, discount, discountAmount, startingDate, expiryDate } = req.body;
    const promoCode = await PromoCode.findById(req.params.id);

    promoCode.name = name;
    promoCode.code = code;
    promoCode.description = description;
    promoCode.discount = discount;
    promoCode.discountAmount = discountAmount;
    promoCode.startingDate = startingDate;
    promoCode.expiryDate = expiryDate;
    await promoCode.save();

    return res.status(201).json({
      message: "Success",
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
