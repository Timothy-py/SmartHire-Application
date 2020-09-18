// this file consists of path to files required by sequelize

const path =  require("path");


module.exports = {
    "config": path.resolve('./dbServer/config', 'config.json'), //contains app config settings e.g DB auth config
    "models-path": path.resolve('./dbServer/models'), // holds the application models
    "seeders-path": path.resolve('./dbServer/seeders'), // holds seed data
    "migrations-path": path.resolve('./dbServer/migrations') // contains app migrations
};