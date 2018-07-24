const pg = require('pg-promise')();
require( 'dotenv' ).config();

const db = pg(process.env.DATABASE_URL);

module.exports = db;