const Joi = require('joi');
const { unique, exists } = require('./custom.validation');

const publicTicketValidateSchema = {
    body: Joi.object().keys({
        phone_number: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .external(exists('UserPurchasedPool', 'phone_number'))
        .messages({
            'string.pattern.base': 'Phone number must be a 10-digit number',
            'any.required': 'Phone number is required'
        }),
        
        full_code: Joi.string()
        .required()
        .external(exists('UserPurchasedPool', 'full_code'))
        .messages({
            'any.required': 'Full code is required',
            'string.external': 'Full code does not exist'
        })
    })
};



module.exports = { publicTicketValidateSchema  };