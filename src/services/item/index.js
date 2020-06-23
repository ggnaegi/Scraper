import {token}  from "../passport";
import {Router} from "express";

export const routerFactory = ({bodyValidation, idValidation}, {create, show, index, update = null, destroy = null}) => {

    const router = new Router();

    router.route("/")
        .get(index)
        .post(token(), bodyValidation(true), create);

    router.route("/:id")
        .get(idValidation, show);

    if (destroy) {
        router.route("/:id")
            .delete(token(), idValidation, destroy);
    }

    if (update) {
        router.route("/:id")
            .put(token(), idValidation, bodyValidation(false), update);
    }

    return router;
};