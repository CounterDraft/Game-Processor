'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
// var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config.json')[env];
var db_config = GLOBAL.config.database;
var db = {};

if (config.database_url) {
    var sequelize = new Sequelize(config.database_url);
} else {
    var sequelize = new Sequelize(db_config.database, db_config.user, db_config.password, {
        host: db_config.host,
        port: db_config.port,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });
}
sequelize.authenticate()
    .then(function(err) {
        logger.info('Connection has been established successfully');
    })
    .catch(function(err) {
        console.error('Unable to connect to the database:', err);
    });

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;



module.exports = db;
