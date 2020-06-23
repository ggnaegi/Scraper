import {notFound, success, successFullDeletion} from "../../services/response";
import Room                                     from "./model";

export const create = (req, res, next) =>
    Room.create({id:req.body.id, capacity:req.body.capacity, userId:req.user.id, locationId: req.params.id})
        .then(success(res, 201))
        .catch(next);

export const show = (req, res, next) =>
    Room.findOne({where: {id: req.params.roomId, locationId: req.params.id}})
        .then(notFound(res))
        .then(success(res))
        .catch(next);

export const index = (req, res, next) =>
    Room.findAll({where: {locationId: req.params.id}})
        .then(notFound(res))
        .then(success(res))
        .catch(next);

export const destroy = (req, res, next) =>
    Room.destroy({where: {id: req.params.roomId, locationId: req.params.id}})
        .then(successFullDeletion(res))
        .catch(next);