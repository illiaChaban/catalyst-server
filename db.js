const pg = require('pg-promise')();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'catalyst',
    user: 'aarongross',
};
const db = pg(dbConfig);

module.exports = db;