import Joi               from "@hapi/joi";
import {ValidationError} from "../utils";

const idDefinition = Joi.number().integer().min(1).required();
const stringIdDefinition = Joi.string().min(3).max(255).required();

const idValidationSchema = Joi.object({
    id: idDefinition
});

const stringIdValidationSchema = Joi.object({
    id: stringIdDefinition
});

const roomIdValidationSchema = Joi.object({
    id: stringIdDefinition,
    roomId: stringIdDefinition
});

const scrapIdValidationSchema = Joi.object({
    id: stringIdDefinition,
    scrapId: idDefinition
});

/***
 * Validating query body
 * https://github.com/hapijs/joi/issues/556#issuecomment-268573076
 * If a key is explicitly marked .optional() in the schema, that presence flag is not overwritten with the validate option presence: "required", so I think this still works.
 * schema.validate({name: "jonathan", nick: "jon"}, { presence: "required"});
 *
 * @param schema
 * @param post
 * @param isFile
 * @returns {function(...[*]=)}
 */
export const bodyValidation = function (schema, post = false) {
    return function (req, res, next) {
        const {error} = schema.validate(req.body, {
            abortEarly: false,
            presence: post ? "required" : "optional"
        });

        if (!error) {
            return next();
        }

        new ValidationError(error).json(req, res, 422);
    };
};

/***
 * Validating Url Parameters for Rooms
 * @returns {function(...[*]=)}
 */
export const roomIdValidation = function () {
    return function (req, res, next) {
        const {error} = roomIdValidationSchema.validate(req.params);

        if (!error) {
            return next();
        }

        new ValidationError(error).json(req, res, 422);
    };
};

/***
 * Validating Url Parameters for Scraps
 * @returns {function(...[*]=)}
 */
export const scrapIdValidation = function () {
    return function (req, res, next) {
        const {error} = scrapIdValidationSchema.validate(req.params);

        if (!error) {
            return next();
        }

        new ValidationError(error).json(req, res, 422);
    };
};

/***
 * Validating Ids and Hash passed as parameters
 * @param isString
 * @returns {function(...[*]=)}
 */
export const idValidation = function (isString) {
    return function (req, res, next) {
        const {error} = isString ? stringIdValidationSchema.validate(req.params) : idValidationSchema.validate(req.params);

        if (!error) {
            return next();
        }

        new ValidationError(error).json(req, res, 422);
    };
};

export const stdIdValidation = idValidation(false);