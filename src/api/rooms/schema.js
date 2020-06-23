import Joi                                                                                from "@hapi/joi";
import {bodyValidation as bodyValidationService, roomIdValidation as idValidationService} from "../../services/joi";

const roomsSchema = (post) => Joi.object({
    id: post ? Joi.string().min(3).max(255) : Joi.forbidden(),
    capacity: Joi.number().integer().min(0)
});

export const idValidation = idValidationService();
export const bodyValidation = (post) => bodyValidationService(roomsSchema(post), post);