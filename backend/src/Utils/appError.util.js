class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    this.status =
      this.statusCode >= 400 && this.statuscode < 500 ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
