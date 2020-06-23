import {Router} from "express";
import config   from "../config";

import auth      from "./auth";
import locations from "./locations";
import users from "./users";

const baseRouter = new Router();
const router = new Router();

baseRouter.use("/api/v" + config.apiVersion, router);
router.use("/auth", auth);
router.use("/locations", locations);
router.use("/users", users);

export default baseRouter;