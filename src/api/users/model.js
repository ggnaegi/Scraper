import Sequelize   from "sequelize";
import bcrypt      from "bcrypt";
import {sequelize} from "../../services/sequelize";
import Item        from "../../services/item/model";
import config      from "../../config";

export class User extends Item {
    view() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        };
    }

    /***
     * Verifying password hash against db value
     * @param password
     * @returns {Promise<unknown>}
     */
    authenticate(password) {
        return bcrypt.compare(password, this.password).then((valid) => valid ? this : false);
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        field: "ID",
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    firstName: {
        type: Sequelize.STRING,
        field: "FirstName",
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        field: "LastName",
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        field: "Email",
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        field: "Password"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "UpdatedAt",
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "CreatedAt",
        allowNull: false
    }
}, {sequelize});

/***
 * Hashing user Password
 * @TODO should check needed hashing rounds
 * @param user
 * @returns {Promise<unknown>}
 */
const hashPassword = (user) => {
    return new Promise((resolve, reject) => {
        const rounds = config.env === "test" ? 1 : 9;
        bcrypt.hash(user.password, rounds, (err, hash) => {
            if (err) {
                return reject(err);
            }
            user.password = hash;
            resolve();
        });
    });
};

User.addHook("beforeValidate", async (user) => {
    if (user.changed("password") || user.isNewRecord) {
        await hashPassword(user);
    }
});

export default User;
