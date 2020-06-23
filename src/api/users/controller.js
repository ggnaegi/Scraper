import {User as model} from "./model";
import {
    create as _create,
    destroy as _destroy,
    index as _index,
    show as _show,
    update as _update
}                      from "../../services/item/controller";

export const create = _create(model);
export const show = _show(model);
export const index = _index(model);
export const update = _update(model);
export const destroy = _destroy(model);