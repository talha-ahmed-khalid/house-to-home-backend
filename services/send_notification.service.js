const Notification = require("../models/Notification");
// const io = require("../utils/socket");

exports.SendNotification = async (data) => {
  try {
    const { message, payload } = data;
    const notification = new Notification({
      message,
      payload,
    });
    await notification.save();
    // if (to === "Admin")
    //   await io.getIO().in("AdminRoom").emit("Notification", notification);
    // else await io.getIO().in(to.toString()).emit("Notification", notification);
  } catch (error) {
    return true;
  }
};
