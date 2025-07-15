const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
require('dotenv').config();

// Determine the env file path dynamically
let envFilePath = null;
const envFileArgIndex = process.argv.indexOf("--env-file");
if (envFileArgIndex !== -1 && process.argv[envFileArgIndex + 1])
  envFilePath = process.argv[envFileArgIndex + 1];
if (!envFilePath && process.env.ENV_FILE) envFilePath = process.env.ENV_FILE;

switch (process.env?.NODE_ENV) {
  case "local":
    envFilePath = ".env.local";
    break;
  case "development":
    envFilePath = ".env.dev";
    break;
  case "production":
    envFilePath = ".env";
    break;
  default:
    envFilePath = ".env.local";
}

// Resolve the full path to the env file (assuming your .env files are two levels up)
const fullEnvPath = path.join(process.cwd(), envFilePath);
dotenv.config({ path: fullEnvPath });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "local")
      .required(),
    PORT: Joi.number().default(3000),

    DB_DIALECT: Joi.string()
      .required()
      .description("Database dialect (e.g., mysql, postgres)"),
    DB_WRITE_HOST: Joi.string().required().description("Database write host"),
    DB_WRITE_USERNAME: Joi.string()
      .required()
      .description("Database write username"),
    // DB_WRITE_PASSWORD: Joi.string()
    //   .required()
    //   .description("Database write password"),
    DB_WRITE_DATABASE: Joi.string()
      .required()
      .description("Database write database"),
    DB_READ_HOST: Joi.string().required().description("Database read host"),
    DB_READ_USERNAME: Joi.string()
      .required()
      .description("Database read username"),
    // DB_READ_PASSWORD: Joi.string()
    //   .required()
    //   .description("Database read password"),
    DB_READ_DATABASE: Joi.string()
      .required()
      .description("Database read database"),
    DB_LOGGING: Joi.boolean()
      .default(false)
      .description("Enable or disable database logging"),

      LOG_LEVEL: Joi.string().default("info").description("Log level"),
      LOG_MAX_SIZE: Joi.string()
        .default("20m")
        .description("Maximum log file size before rotation"),
      LOG_MAX_FILES: Joi.string()
        .default("30d")
        .description("Maximum number of log files to keep"),
      LOG_FILE_TRANSPORT: Joi.boolean()
        .default(false)
        .description("Enable file transport for logs"),
        MESSAGE_QUEUING: Joi.boolean()
        .default(true)
        .description("Enable or disable message queuing"),
      // RABBITMQ_URL: Joi.string().required().description("RabbitMQ url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),

    REDIS_HOST: Joi.string().default("localhost").description("Redis host"),
    REDIS_PORT: Joi.number().default(6379).description("Redis port"),
    EMAIL_USER: Joi.string().email().required(),
    EMAIL_PASS: Joi.string().required(),
    MAILER_HOST: Joi.string().default("smtp.example.com").description("SMTP host"),
    MAILER_PORT: Joi.number().default(587).description("SMTP port"),
    
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  server_url: envVars.SERVER_URL,
  port: envVars.PORT,
  database: {
    dialect: envVars.DB_DIALECT,
    write: {
      host: envVars.DB_WRITE_HOST,
      username: envVars.DB_WRITE_USERNAME,
      password: envVars.DB_WRITE_PASSWORD,
      database: envVars.DB_WRITE_DATABASE,
    },
    read: {
      host: envVars.DB_READ_HOST,
      username: envVars.DB_READ_USERNAME,
      password: envVars.DB_READ_PASSWORD,
      database: envVars.DB_READ_DATABASE,
    },
    logging: envVars.DB_LOGGING,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  logger: {
    level: envVars.LOG_LEVEL,
    maxSize: envVars.LOG_MAX_SIZE,
    maxFiles: envVars.LOG_MAX_FILES,
    fileTransport: envVars.LOG_FILE_TRANSPORT,
  },
  messageQueuing: {
    status: envVars.MESSAGE_QUEUING,
    // rabitmq_url: envVars.RABBITMQ_URL,
  },
  mailer:{
    email_user: envVars.EMAIL_USER,
    email_pass: envVars.EMAIL_PASS,
    host: envVars.MAILER_HOST,
    port: envVars.MAILER_PORT,

  }
 
};
