import {notFound, success} from "../../services/response";
import Price                                     from "./model";

export const show = (req, res, next) =>
    Price.findOne({where: {id: req.params.priceId, scrapId: req.params.scrapId}})
        .then(notFound(res))
        .then(success(res))
        .catch(next);

export const index = (req, res, next) =>
    Price.findAll({where: {scrapId: req.params.scrapId}})
        .then(notFound(res))
        .then(success(res))
        .catch(next);