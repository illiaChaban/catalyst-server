const pg = require('pg-promise')();

// const dbConfig = 'postgres://illia_chaban@localhost:5432/brainMe';

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'brainMe',
    user: 'illia_chaban',
    // password: 'user-password'
};
const db = pg(dbConfig);