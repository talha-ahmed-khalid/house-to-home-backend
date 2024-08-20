const fs = require("fs");

exports.getFilePath = async (file, fileName) => {
  try {
    return file && file[fileName] && file[fileName][0] && file[fileName][0].path;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.deleteFile = async (path) => {
  try {
    fs.unlink(path, () => {});
  } catch (err) {
    return err;
  }
};
