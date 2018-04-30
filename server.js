const express = require('express');
const http = require('http');
const pg = require('pg-promise')();
const cors = require('cors');
// const urlencoded = require('body-parser').urlencoded;

// const dbConfig = 'postgres://illia_chaban@localhost:5432/catalyst';

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'catalyst',
    user: 'illia_chaban',
    // password: 'user-password'
};
const db = pg(dbConfig);

const Router = require('express').Router;
const router = new Router();

router.get('/', (req, res) => {
    res.send('hello');
});

router.post('/users', (req, res) => {
    // let request = JSON.parse(req);
    console.log('####################')
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        db.query(body).then(console.log);
        db.query('select * from users').then(console.log)
    })
    // res.send(request);
    // res.send('hello')
})

const app = express();
// app.use(express.static(__dirname + '/public'));
// app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const server = http.createServer(app)

console.log('HTTP server running at http://localhost:5000');
server.listen(5000);