import {Sequelize} from "sequelize";
import {sequelize} from "../../services/sequelize";
import {Room}      from "../rooms/model";
import {Scrap}     from "../scraps/model";
import Item        from "../../services/item/model";

export class Price extends Item {
    view() {
        return {
            id: this.id,
            scrapId:this.scrapId,
            roomId: this.roomId,
            priceForDate: this.priceForDate,
            datePrice: this.datePrice,
            dateCustomPrice: this.dateCustomPrice,
            bookedRooms: this.bookedRooms
        };
    }
}

Price.init({
    id: {
        type: Sequelize.INTEGER,
        field: "ID",
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    scrapId: {
        type: Sequelize.INTEGER,
        field: "ScrapID",
        allowNull: false,
        required: true,
        references: {
            model: Scrap,
            key: "id"
        }
    },
    roomId: {
        type: Sequelize.STRING,
        field: "RoomID",
        allowNull: false,
        required: true,
        references: {
            model: Room,
            key: "id"
        }
    },
    priceForDate: {
        type: Sequelize.DATE,
        field: "PriceForDate",
        required: true,
        allowNull: false
    },
    datePrice: {
        type: Sequelize.INTEGER,
        field: "DatePrice",
        allowNull: true,
        required: true
    },
    dateCustomPrice: {
        type: Sequelize.INTEGER,
        field: "DateCustomPrice",
        allowNull: true,
        required: true
    },
    bookedRooms: {
        type: Sequelize.INTEGER,
        field: "BookedRooms",
        defaultValue: 0,
        allowNull: false,
        required: true
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "CreatedAt",
        allowNull: false
    }
}, {updatedAt: false, sequelize});

export default Price;