const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media");
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.split(".").pop();
    cb(null, uuidv4() + "." + extension);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "profileImage" ||
    file.fieldname === "challanImages" ||
    file.fieldname === "image" ||
    file.fieldname === "mainImage"
  ) {
    if (file.mimetype.includes("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "images") {
    if (file.mimetype.includes("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};

module.exports = {
  fileStorage,
  fileFilter,
};
