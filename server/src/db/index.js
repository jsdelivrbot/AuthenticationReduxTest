/**
 * Created by dragos on 08/06/2017.
 */

/**
 This file is used to set up the DB connection to postgresSQL using sequelize
 */
const config = require('../../config/default');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.url);

class dbInit {
    constructor() {
        this.instance = sequelize;
        sequelize
            .authenticate()
            .then(() => {
                console.log("connected to postgres DB");
            })
            .catch(err => {
                console.log("unable to connect to postgres DB:", err);
                throw new Error(err);
            });
    }

    getInstance(){
        return this.instance;
    }
}

/**
 * Export the default singleton of the db initialization class
 */
module.exports = new dbInit();