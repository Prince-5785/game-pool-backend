// Success Response Function
const sendSuccess = (res, message, code=200, data=[] ) => {
    res.status(code).send({
      status: true,
      // code,
      data,
      message,
    });
  };
  
  // Error Response Function
  const sendError = (res, message, code=400, data=[]) => {
    res.status(code).send({
      status: false,
      // code,
      message,
      data,
    });
  };
  
  module.exports = { sendSuccess, sendError };
  