module.exports = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    error.statuscode = 400;
    error.status = "Bad Request";
    error.message = Object.values(error.errors)[0].message;
  }
  error.statuscode = error.statuscode || 500;
  error.status = error.status || "error";
  res.status(error.statuscode).json({
    success: false,
    message: error.message || "Internal Server Error",
    status: error.status || "Error",
    statuscode: error.statuscode || 500,
  });
  if (error.code === 11000) {
    error.statuscode = 409;
    error.message = `${Object.keys(error.keyValue)[0]} already exists`;
  }
};
