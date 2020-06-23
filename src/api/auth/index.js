import {Router}                     from "express";
import {login}                      from "./controller";
import {userAuthentication} from "../../services/passport";

const router = new Router();

router.route("/")
    .post(userAuthentication(), login);

export default router;