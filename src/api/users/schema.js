import Joi                                                                            from "@hapi/joi";
import {bodyValidation as bodyValidationService, idValidation as idValidationService} from "../../services/joi";

const userSchema = Joi.object({
    firstName: Joi.string().min(3).max(255),
    lastName: Joi.string().min(3).max(255),
    shortName: Joi.string().min(3).max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(255)
});

export const idValidation = idValidationService(false);
export const bodyValidation = post => bodyValidationService(userSchema, post);