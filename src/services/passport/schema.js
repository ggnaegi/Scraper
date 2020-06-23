import Joi from "@hapi/joi";

export const emailValidation = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(8)
        .required()
});