import express                                 from "express";
import forceSSL                                from "express-force-ssl";
import cors                                    from "cors";
import compression                             from "compression";
import morgan                                  from "morgan";
import methodOverride                          from "method-override";
import {errorHandler as sequelizeErrorHandler} from "../sequelize";
import {errorHandler as defaultErrorHandler}   from "../error";
import {parseJson, urlEncoded}                 from "../bodyParser";
import config                                  from "../../config";


export default (apiRoot, routes) => {

    const app = express();
    /* istanbul ignore next */
    if (config.env === "production") {
        app.set("forceSSLOptions", {
            enable301Redirects: false,
            trustXFPHeader: true
        });
        app.use(forceSSL);
    }

    app.use(cors());
    app.use(compression());

    if (config.env === "development") {
        app.use(morgan("dev"));
    }

    app.use(urlEncoded());
    app.use(parseJson());
    app.use(methodOverride());
    app.use(apiRoot, routes);
    app.use(sequelizeErrorHandler());
    app.use(defaultErrorHandler());

    return app;
};
