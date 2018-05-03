const express = require('express');
const http = require('http');
const pg = require('pg-promise')();
const cors = require('cors');
const readBody = require('./lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
let {postTokens, signature} = require('./lib/tokens');
// const urlencoded = require('body-parser').urlencoded;

// const dbConfig = 'postgres://illia_chaban@localhost:5432/catalyst';

const dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'catalyst',
    user: 'illia_chaban',
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

router.get('/friends', async (req, res) => {
    let { authorization: token } = req.headers;
    try{
        let { userid } = jwt.verify(token, signature);
        console.log(userid)
        let friends = await db.one(`
            SELECT friendsarray FROM friends
            WHERE userid = '${userid}';
        `)
        res.end(friends.friendsarray)
    } catch(err) {
        console.log(err)
    }
})

router.post('/feed', async (req,res) => {
    let friendsArr = await readBody(req).then( req => JSON.parse(req));
    
    let query = '';
    friendsArr.forEach( (friendId, i) => {
        query += `users.userid = '${friendId}' `;
        if ( i !== friendsArr.length - 1) query += 'OR ';
    })

    let feed = await db.query(`
        SELECT goals.goalname, goals.deadline,
        users.username, users.avatar,
        checkins.image, checkins.description, checkins.created
        FROM goals
            JOIN users
                ON users.userid = goals.userid
            JOIN checkins
                ON goals.goalid = checkins.goalid
            WHERE ${query};
    `)

    res.end(JSON.stringify(feed));
})

router.get('/user/me', async (req,res) => {
    let { authorization: token } = req.headers;
    try{
        let payload = jwt.verify(token, signature);
        let me = await db.one(`
            SELECT username, userid, avatar FROM users
            WHERE userid = '${payload.userid}';
        `)
        res.end(JSON.stringify(me))
    } catch(err) {
        console.log(err)
        res.status(401).end('Unauthorized');
    }
})

const app = express();
// app.use(express.static(__dirname + '/public'));
// app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const server = http.createServer(app)

console.log('HTTP server running at http://localhost:5000');
server.listen(5000);