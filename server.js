const express = require('express');
const http = require('http');
const pg = require('pg-promise')();
const cors = require('cors');
const readBody = require('./lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
// const urlencoded = require('body-parser').urlencoded;

// const dbConfig = 'postgres://illia_chaban@localhost:5432/catalyst';

const signature = '1mm@_s5cur5_s11rv3r';

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
    readBody(req).then( (req) => {
        db.query(req).then(console.log);
        db.query('select * from users').then(console.log)
    })
    // res.send(request);
    // res.send('hello')
})

router.post('/login', (req,res) => {
    readBody(req).then(console.log)

})

router.post('/goals', (req,res) => {
    readBody(req).then( goal => {
        console.log(goal);
        db.query(`
            INSERT INTO goals VALUES (
                ${goal.user.userid},
                ${goal.titla},
                ${goal.description},
                ${goal.deadline},
                ${moment().format('L')},
                ${goal.punishment}
            );
        `)
    });
})

router.post('/feed', (req,res) => {
    let feed = [];
    readBody(req)
        .then( req => JSON.parse(req))
        .then( req => {
        console.log(req.userid)
        db.query(`
            SELECT friendsarray FROM friends WHERE
                userid = '${req.userid}';
        `).then(res => JSON.parse(res[0].friendsarray))
        .then(arr =>{
            arr.forEach( (el,i) => {
                db.query(`
                    SELECT * FROM goals WHERE
                        userid = '${el}';
                `).then(res => res[0].goalid)
                    .then(goalid => {
                        db.query(`
                            SELECT * FROM checkins WHERE
                                goalid = '${goalid}';
                        `).then(checkin => {
                            feed.push(checkin[0])
                            if ( i === arr.length - 1) res.send(JSON.stringify(feed))
                        })
                    })
            })
        })
        
    })
})

const app = express();
// app.use(express.static(__dirname + '/public'));
// app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const server = http.createServer(app)

console.log('HTTP server running at http://localhost:5000');
server.listen(5000);