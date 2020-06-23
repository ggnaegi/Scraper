/***
 * Returning given Date d year and month
 * @param d
 * @returns {{month: string, year: string}}
 */
import {baseErrorDescriptor, detailErrorDescriptor, GenericError} from "../error";
import path                                                       from "path";
import config from "../../config";

const getTwoDigitsDateElement = (dateElement) => {
    return `${dateElement}`<10? '0'+`${dateElement}`:''+`${dateElement}`
}

const getDateYearMonthAndDay = ({d}) => {
    return {year:new Intl.DateTimeFormat("en", {year:"numeric"}).format(d),
        month:getTwoDigitsDateElement(d.getMonth()+1),
        day:getTwoDigitsDateElement(d.getDate())
    };
}

/***
 * Formatting Date as format differ from an API to the other
 * @param jsonDate
 */
export const formatDate = ({jsonDate}) => {
    const d = new Date(`${jsonDate}`);
    const ymd = getDateYearMonthAndDay({d});
    return `${ymd.year}`+"-"+`${ymd.month}`+"-"+`${ymd.day}`;
}

/***
 * Getting Time Span Parameter for pricenow apis
 * current month's first day to the first day two months ahead
 * let the apis deal with the month's last day for us.
 * @returns {string}
 */
export const getTimeSpanParameter = () => {
    let d = new Date();
    const src = getDateYearMonthAndDay({d});
    d.setMonth(d.getMonth()+2);
    const dst = getDateYearMonthAndDay({d});
    return "from="+`${src.year}`+"-"+`${src.month}`+"-01&to="+`${dst.year}`+"-"+`${dst.month}`+"-01";
}

export const hyphenate = str => {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
};

// Utils struct errors

/***
 *  Error thrown when object type failed
 * @type {{name, message, serviceName, statusCode}}
 */
const CheckObjectTypeError = baseErrorDescriptor({
    name: "CheckObjectTypeError",
    title: "Check Object Type Failed, Wrong Variable Type as Input",
    serviceName: "services/utils",
    statusCode: 403
});

/***
 * Thrown error class when function parseBool fails
 */
export class BooleanParsingError extends Error {
    constructor(inputString) {
        super("Input String " + inputString + " Couldn\"t be parsed as boolean");
    }
}


/***
 *  * Avoiding Generic Object Sink
 * Checking if variable is a string
 * otherwise should throw
 * @param value
 * @returns {*}
 */
export const checkString = value => {
    if (typeof value !== "string" && !value instanceof String) {
        throw new GenericError({
            ...CheckObjectTypeError,
            ...detailErrorDescriptor({
                detail: "Check String Type Failed, Wrong Variable Type as Input",
                calledFunction: "checkString"
            })
        });
    }

    return value;
};

/***
 * Trying to parse input strings as boolean.
 * If Parsing fails, then an Error "BooleanParsingError" is thrown
 * @param inputString
 * @returns {boolean}
 */
export const parseBool = ({inputString}) => {
    let str = inputString.toLowerCase().trim();
    if (str === "1" || str === "true") {
        return true;
    }

    if (str !== "0" && str !== "false") {
        throw new BooleanParsingError(inputString);
    }

    return false;
};

/***
 * Validation Error Class used when hapi/joi validation fails
 */
export class ValidationError extends Error {
    constructor(joiValidationError) {
        super(joiValidationError.message);
        this.joiValidationError = joiValidationError;
    }

    getValidationErrorsToJson() {
        if (!this.joiValidationError.details || this.joiValidationError.details.length === 0) {
            return null;
        }

        let errors = [];
        this.joiValidationError.details.forEach(validationError => {
            errors.push({
                message: validationError.message,
                type: validationError.type,
                path: validationError.context.label,
                key: validationError.context.key,
                value: validationError.context.value
            });
        });
        return errors;
    }

    json(req, res, statusCode) {
        res.status(statusCode).json({
            type: path.join(config.errorTypesBaseUrl, hyphenate(this.constructor.name)),
            title: this.constructor.name,
            status: statusCode,
            detail: this.message,
            instance: req.originalUrl,
            context: {
                httpMethod: req.method,
                requestParams: req.params,
                requestBody: req.body,
                errors: this.getValidationErrorsToJson()
            }
        });
    }
}