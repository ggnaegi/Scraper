import {bodyValidation, idValidation} from "./schema";
import {Router}                       from "express";
import {create, destroy, index, show} from "./controller";
import {token}                        from "../../services/passport";

const router = new Router({mergeParams: true});

router.route("/")
    .get(index)
    .post(token(), bodyValidation(true), create);

router.route("/:roomId")
    .get(idValidation, show)
    .delete(token(), idValidation, destroy);

export default router;
