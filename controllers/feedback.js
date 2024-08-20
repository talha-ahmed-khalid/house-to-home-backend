const moment = require("moment");
const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res, next) => {
  try {
    const { name, email, subject, message, userType } = req.body;

    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      userType,
    });

    await feedback.save();
    return res.status(201).json({ message: "Thank you for contacting us!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id).lean();
    return res.status(200).json({ feedback });
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
    const logs = await Feedback.paginate(
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
