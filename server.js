const express = require('express');
const http = require('http');
const pg = require('pg-promise')();
const cors = require('cors');
const readBody = require('./lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
let postTokens = require('./lib/tokens');
// const urlencoded = require('body-parser').urlencoded;

// const dbConfig = 'postgres://illia_chaban@localhost:5432/catalyst';

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'catalyst',
    user: 'aarongross',
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

router.post('/login', async (req,res) => {
    postTokens(req, res, db)
})

router.post('/register',  (req,res) => {
    readBody(req)
    .then(data => JSON.parse(data))
    .then(parsedData => {
    let {avatar, username,email,passw} = parsedData
    bcrypt.hash(passw,10, async (err, hash,) => {
        let hashUser = {
            avatar,
            username,
            email,
            passw:hash
        }
        db.query(`INSERT INTO users VALUES 
    (
        '${hashUser.avatar}',
        '${hashUser.username}',
        '${hashUser.email}',
        '${hashUser.passw}'
    );`) 
        .catch(err => console.log(err))
        res.send('finished insert')
    })
})
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