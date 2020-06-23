import {Sequelize} from "sequelize";
import {sequelize} from "../../services/sequelize";
import {User}      from "../users/model";
import {Location}  from "../locations/model";
import Item        from "../../services/item/model";

export class Scrap extends Item {
    view() {
        return {
            id: this.id,
            locationId: this.locationId,
            createdAt: this.createdAt
        };
    }
}

Scrap.init({
    id: {
        type: Sequelize.INTEGER,
        field: "ID",
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
    locationId: {
        type: Sequelize.STRING,
        field: "LocationID",
        allowNull: false,
        required: true,
        references: {
            model: Location,
            key: "id"
        }
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "CreatedAt",
        allowNull: false
    }
}, {updatedAt: false, sequelize});

export default Scrap;