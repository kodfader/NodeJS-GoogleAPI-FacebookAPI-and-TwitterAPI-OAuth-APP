// validations/authValidation.js
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().messages({
            'string.empty': 'Username is required',
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email',
        }),
        password: passwordComplexity(complexityOptions).required().messages({
            'string.empty': 'Password is required',
            'passwordComplexity.tooShort': 'Password should have at least 8 characters',
            'passwordComplexity.tooLong': 'Password should have at most 30 characters',
            'passwordComplexity.lowercase': 'Password should have at least one lowercase letter',
            'passwordComplexity.uppercase': 'Password should have at least one uppercase letter',
            'passwordComplexity.numeric': 'Password should have at least one numeric character',
            'passwordComplexity.symbol': 'Password should have at least one symbol',
        }),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email',
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required',
        }),
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };