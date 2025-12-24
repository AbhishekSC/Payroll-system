import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    message: err.message || "Internal error",
  });
};
