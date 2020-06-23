import {Location as model}              from "./model";
import {index as _index, show as _show} from "../../services/item/controller";
import {success}                        from "../../services/response";

export const create = (req, res, next) =>
    model.create({id: req.body.id, userId: req.user.id})
        .then((object) => object ? object.view() : null)
        .then(success(res, 201))
        .catch(next);

export const show = _show(model);
export const index = _index(model);