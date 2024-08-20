const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Not Authenticated");
      error.statucCode = 401;
      throw error;
    }

    const token = req.get("Authorization").split(" ")[1];
    let decodedToken = "";
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const error = new Error("Not Authenticated");
      error.statusCode = 401;
      throw error;
    }

    if (!decodedToken.scope.isAdmin) throw new Error("Not Authenticated");
    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    return res.status(405).json({
      message: "Logged Out",
    });
  }
};
