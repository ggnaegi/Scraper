import {Router}                     from "express";
import {login}                      from "./controller";
import {master, userAuthentication} from "../../services/passport";

const router = new Router();

router.route("/")
    .post(master(), userAuthentication(), login);

export default router;