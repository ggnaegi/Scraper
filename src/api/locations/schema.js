import Joi                                                                            from "@hapi/joi";
import {bodyValidation as bodyValidationService, idValidation as idValidationService} from "../../services/joi";

const locationSchema = Joi.object({
    id: Joi.string().min(3).max(255)
});

export const idValidation = idValidationService(true);
export const bodyValidation = (post) => bodyValidationService(locationSchema, post);