const s = (socket, next) => {
  if (socket[0] !== "message") {
    next(new Error("socket error"));
  } else {
    next();
  }
};
module.exports = s;
