import {Model}                               from "sequelize";
import {NoObjectForPrimaryKeyError}          from "../sequelize";
import {detailErrorDescriptor, GenericError} from "../error";

export class Item extends Model {

}

Item.findById = async function (...args) {
    const obj = await this.findByPk(args[0]);
    if (obj === null) {
        throw new GenericError({
            ...NoObjectForPrimaryKeyError,
            ...detailErrorDescriptor({
                detail: "Primary key " + args[0] + "not Found in " + this.name,
                calledFunction: "api/" + this.name.toLowerCase() + "/model/findById",
                inputVariables: args[0]
            })
        });
    }

    return obj;
};

export default Item;
