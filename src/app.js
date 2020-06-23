import http    from "http";
import config  from "./config";
import express from "./services/express";
import api     from "./api";
import cluster from "cluster";
import os      from "os";

const app = express(config.apiRoot, api);

const createServer = () => {
    const server = http.createServer(app);

    setImmediate(() => {
        server.listen(config.port, config.ip, () => {
            console.log("Express server listening on http://%s:%d, in %s mode using api Version %s", config.ip,
                config.port, config.env, config.apiVersion);
        });
    });
};

if (config.enableClustering && cluster.isMaster) {
    const cpuCount = os.cpus().length / 2;
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
    Object.keys(cluster.workers).forEach(function (id) {
        console.log("I am running with ID : " + cluster.workers[`${id}`].process.pid);
    });
} else {
    createServer();
}

app.get("*", (req, res) => {
    res.status(404).json("Not found!");
});

export default app;
