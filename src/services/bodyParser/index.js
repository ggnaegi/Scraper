import {GenericError}                               from "../utils";
import bodyParser                                   from "body-parser";
import {baseErrorDescriptor, detailErrorDescriptor} from "../error";

//body Parser Errors Structs

const UrlEncodedError = baseErrorDescriptor({
    name: "UrlEncodedError",
    title: "Error occurred in BodyParser UrlEncoded",
    serviceName: "services/bodyParser",
    statusCode: 403
});

const InvalidJsonInputError = baseErrorDescriptor({
    name: "InvalidJsonInputError",
    title: "Unable to parse Json Body",
    serviceName: "services/bodyParser",
    statusCode: 403
});

/***
 * Handling Errors when parsing with bodyParser fails.
 * (invalid json as input in request"s body
 * @returns {function(...[*]=)}
 */
export function parseJson() {
    return function (req, res, next) {
        bodyParser.json()
        (req, res, err => {
            if (err) {
                return next(new GenericError({
                    ...InvalidJsonInputError,
                    ...detailErrorDescriptor({
                        calledFunction: "parseJson",
                        innerError: err
                    })
                }));
            }
            next();
        });
    };
}

/***
 *
 * @returns {function(...[*]=)}
 */
export function urlEncoded() {
    return function (req, res, next) {
        bodyParser.urlencoded({extended: false})
        (req, res, err => {
            if (err) {
                return next(new GenericError({
                    ...UrlEncodedError,
                    ...detailErrorDescriptor({
                        calledFunction: "urlEncoded",
                        innerError: err
                    })
                }));
            }
            next();
        });
    };
}