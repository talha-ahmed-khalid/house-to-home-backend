module.exports = {
  ...require("./auth.service"),
  ...require("./generate_email.service"),
  ...require("./file.service"),
  // ...require("./send_notification.service"),
};
