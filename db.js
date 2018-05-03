const pg = require('pg-promise')();

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'catalyst',
    user: 'illia_chaban',
};
const db = pg(dbConfig);

module.exports = db;