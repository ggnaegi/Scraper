import {idValidation}        from "./schema";
import {Router}              from "express";
import {create, index, show} from "./controller";
import {token}               from "../../services/passport";
import prices from "../prices";

const router = new Router({mergeParams: true});

router.route("/")
    .get(index)
    .post(token(), create);

router.route("/:scrapId")
    .get(idValidation, show);

router.use("/:scrapId/prices", prices);

export default router;