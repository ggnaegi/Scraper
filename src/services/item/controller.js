import {notFound, success, successFullDeletion} from "../response";

/***
 * Controller function for base items
 * Create (creating new object)
 * @param model
 * @returns {function(*, *=, *): *}
 */
export const create = function (model) {
    return function (req, res, next) {
        return model.create(req.body)
            .then((object) => object ? object.view() : null)
            .then(success(res, 201))
            .catch(next);
    };
};

/***
 * Controller function for base items
 * Index (getting all objects for model)
 * @param model
 * @returns {function(*, *=, *=): Promise<unknown>}
 */
export const index = function (model) {
    return function (req, res, next) {
        return model.findAll()
            .then(notFound(res))
            .then(success(res))
            .catch(next);
    };
};

/***
 * Controller function for base items
 * show (returning object with given id)
 * @param model
 * @returns {function(*, *=, *=): Promise<unknown>}
 */
export const show = function (model) {
    return function (req, res, next) {
        return model.findByPk(req.params.id)
            .then(notFound(res))
            .then(success(res))
            .catch(next);
    };
};

/***
 * Controller function for base items
 * update (updating object with given id)
 * @param model
 * @returns {function(*, *=, *=): Promise<unknown>}
 */
export const update = function (model) {
    return function (req, res, next) {
        return model.findByPk(req.params.id)
            .then(notFound(res))
            .then(aGroup => aGroup ? aGroup.update(req.body) : null)
            .then(success(res))
            .catch(next);
    };
};

/***
 * Controller function for base items
 * destroy (destroying object with given id)
 * @param model
 * @returns {function(*, *=, *=): Promise<any>}
 */
export const destroy = function (model) {
    return function (req, res, next) {
        return model.destroy({where: {id: req.params.id}})
            .then(successFullDeletion(res))
            .catch(next);
    };
};