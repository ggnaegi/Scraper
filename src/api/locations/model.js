import {Sequelize} from "sequelize";
import {sequelize} from "../../services/sequelize";
import {User}      from "../users/model";
import Item        from "../../services/item/model";

export class Location extends Item {
    view() {
        return {
            id: this.id
        };
    }
}

Location.init({
    id: {
        type: Sequelize.STRING,
        field: "ID",
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    userId: {
        type: Sequelize.INTEGER,
        field: "UserID",
        allowNull: false,
        required: true,
        references: {
            model: User,
            key: "id"
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "CreatedAt",
        allowNull: false
    }
}, {updatedAt: false, sequelize});

export default Location;