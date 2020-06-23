import {Scrap as model}    from "./model";
import {notFound, success} from "../../services/response";
import {scrapLocationData} from "../../services/pricenow";

export const create = (req, res, next) =>
    model.create({userId: req.user.id, locationId: req.params.id})
        .then(scrap => scrapLocationData({locationId: req.params.id, scrapId: scrap.id}))
        .then(success(res, 201))
        .catch(next);

export const show = (req, res, next) =>
    model.findOne({where: {id: req.params.scrapId, locationId: req.params.id}})
        .then(notFound(res))
        .then(success(res))
        .catch(next);

export const index = (req, res, next) =>
    model.findAll({where: {locationId: req.params.id}})
        .then(notFound(res))
        .then(success(res))
        .catch(next);