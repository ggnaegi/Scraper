import Sequelize                                                  from "sequelize";
import config                                                     from "../../config";
import {baseErrorDescriptor, detailErrorDescriptor, GenericError} from "../error";

export const sequelize = new Sequelize(config.dbName, config.dbUserName, config.dbPassword, {
    host: config.dbHost,
    port: config.dbPort,
    dialect: config.dbDialect,
    pool: {max: 400, min: 0, idle: 10000},
    timeZone: config.timeZone
})

export const NoObjectForPrimaryKeyError = baseErrorDescriptor({
    name: "NoObjectForPrimaryKeyError",
    title: "Primary Key doesn\"t exist in the given Model",
    serviceName: "services/sequelize",
    statusCode: 400
});

export function errorHandler() {
    return function (err, req, res, next) {
        if (err instanceof Sequelize.UniqueConstraintError || err instanceof Sequelize.ValidationError || err instanceof Sequelize.AccessDeniedError) {
            return next(new GenericError({
                ...baseErrorDescriptor({
                    name: err instanceof Sequelize.UniqueConstraintError ? err instanceof Sequelize.ValidationError ?
                        "UniqueConstraintError" : "ValidationError" : "AccessDeniedError",
                    title: err.message,
                    serviceName: "services/sequelize",
                    statusCode: err instanceof Sequelize.UniqueConstraintError ? err instanceof Sequelize.ValidationError ?
                        409 : 400 : 401
                }),
                ...detailErrorDescriptor({
                    innerError: err
                })

            }));
        } else {
            next(err);
        }
    };
}
