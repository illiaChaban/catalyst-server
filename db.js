const pg = require('pg-promise')();
require( 'dotenv' ).config();

const db = pg(process.env.DATABASE_URL);

db.query(`
    select * from users;
`).then(console.log)

module.exports = db;