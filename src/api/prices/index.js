import {idValidation} from "./schema";
import {Router}                       from "express";
import {index, show} from "./controller";

const router = new Router({mergeParams: true});

router.route("/")
    .get(index)

router.route("/:priceId")
    .get(show);

export default router;
