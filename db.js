const pg = require('pg-promise')();
require( 'dotenv' ).config();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'catalyst',
    // username: process.env.USER,
    // password: process.env.PASSWORD,
}

const db = pg(dbConfig);

module.exports = db;