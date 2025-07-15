const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const {status:httpStatus} = require("http-status");
const morgan = require("./config/morgan");
const passport = require('./config/passport'); 
const apiLimiter = require("./middleware/rateLimiter");
const routes = require("./routes/index");
const { errorConverter, errorHandler } = require("./middleware/error");
const ApiError = require("./utils/ApiError");

const app = express();

// request logging
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// passport authentication
app.use(passport.initialize());

// limit repeated failed requests
app.use("/", apiLimiter);

// api routes
app.use("/", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
