import path                     from "path";
import merge                    from "lodash/merge";
import {checkString, parseBool} from "./services/utils";

const requireProcessEnv = ({name}, bool = false, integer = false) => {
    if (!process.env[`${name}`]) {
        throw new Error("You must set the " + `${name}` + " environment variable");
    }

    const inputString = checkString(process.env[`${name}`]);

    if (!bool && !integer) {
        return inputString;
    }

    if (bool) {
        return parseBool({inputString});
    }

    if (integer) {
        return parseInt(inputString, 10);
    }
};

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
}

if (process.env.NODE_ENV === "development") {
    const dotenv = require("dotenv-safe");
    dotenv.config({
        path: path.join(__dirname, "../.env"),
        sample: path.join(__dirname, "../.env.template")
    });
}

//available node server modes : cli, development, production and docker

const config = {
    all: {
        apiVersion: "1",
        env: process.env.NODE_ENV,
        root: path.join(__dirname, ".."),
        port: process.env.PORT || 9002,
        ip: process.env.IP || "127.0.0.1",
        apiRoot: process.env.API_ROOT || "",
        dbUserName: requireProcessEnv({name:"DB_USER_NAME"}),
        dbPassword: requireProcessEnv({name:"DB_PASSWORD"}),
        dbName: requireProcessEnv({name:"DB_NAME"}),
        dbDialect: requireProcessEnv({name:"DB_DIALECT"}),
        dbHost: requireProcessEnv({name:"DB_HOST"}),
        dbPort: requireProcessEnv({name:"DB_PORT"}),
        jwtSecret: requireProcessEnv({name:"JWT_SECRET"}),
        masterKey: requireProcessEnv({name:"MASTER_KEY"}),
        sequelizeLogging: requireProcessEnv({name:"SEQUELIZE_LOGGING"}, true),
        timeZone: requireProcessEnv({name:"TZ"}),
        enableClustering: requireProcessEnv({name:"ENABLE_CLUSTERING"}, true),
        errorTypesBaseUrl: requireProcessEnv({name:"ERROR_TYPES_BASE_URL"})
    }
};

const m = merge(config.all, config[config.all.env]);
export default m;