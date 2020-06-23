import {Sequelize} from "sequelize";
import {sequelize} from "../../services/sequelize";
import Location    from "../locations/model";
import {User}      from "../users/model";
import Item        from "../../services/item/model";

export class Room extends Item {
    view() {
        return {
            id: this.id,
            capacity: this.capacity
        };
    }
}

Room.init({
    id: {
        type: Sequelize.STRING,
        field: "ID",
        primaryKey: true,
        allowNull: false,
        required: true,
        unique: true
    },
    locationId: {
        type: Sequelize.STRING,
        field: "LocationID",
        allowNull: false,
        required: true,
        references: {
            model: Location,
            key: "ID"
        }
    },
    capacity: {
        type: Sequelize.INTEGER,
        field: "Capacity",
        defaultValue: 0,
        allowNull: false,
        required: true
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "CreatedAt",
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "UpdatedAt",
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        field: "UserID",
        allowNull: false,
        required: true,
        references: {
            model: User,
            key: "ID"
        }
    }
}, {sequelize});

export default Room;