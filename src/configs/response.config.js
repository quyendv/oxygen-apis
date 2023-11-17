import createError from 'http-errors';

const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);

const responseHandler = {
  internalServerError: (res, msg) => {
    const error = createError.InternalServerError(msg);
    return responseWithData(res, error.status, {
      success: false,
      message: error.message || 'Internal Server Error',
    });
  },

  badRequest: (res, msg) => {
    const error = createError.BadRequest(msg);
    return responseWithData(res, error.status, {
      success: false,
      message: error.message,
    });
  },

  unauthorized: (res, msg) => {
    const error = createError.Unauthorized(msg);
    return responseWithData(res, error.status, {
      success: false,
      message: error.message,
    });
  },

  notFound: (res, msg) => {
    const error = createError.NotFound(msg);
    return responseWithData(res, error.status, {
      success: false,
      message: error.message,
    });
  },

  ok: (res, msg, data) => responseWithData(res, 200, data),

  created: (res, msg, data) => responseWithData(res, 201, data),
};

export default responseHandler;
