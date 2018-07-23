const readBody = require('../lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const moment = require('moment');
let {signature, createToken} = require('../lib/tokens');
let findUserByEmail = require('../lib/findUserByEmail');
const db = require('../db');
const Router = require('express').Router;
const router = new Router();


// router.post('/users', (req, res) => {
//     // let request = JSON.parse(req);
//     console.log('####################')
//     readBody(req).then( (req) => {
//         db.query(req).then(console.log);
//         db.query('select * from users').then(console.log)
//     })
//     // res.send(request);
//     // res.send('hello')
// })


router.post('/goals', async (req,res) => {
    console.log( '#### ADDING GOAL')
    let {userid, title, description, deadline, punishment} = await readBody(req).then( req => JSON.parse(req));//req.body;
    db.query(`
        INSERT INTO goals
        ( userids, goalname, description, deadline, created, punishment )
        VALUES (
            '${userid}',
            '${title}',
            '${description}',
            '${deadline}',
            '${new Date().toISOString()}',
            '${punishment}'
        );
    `)
    .then( () => console.log( 'about to add a goal'))
    .then( () => console.log( 'added a goal succesfully'))
    .catch(console.log)

})

router.get('/friends', async (req, res) => {
    console.log( '##### GETTING REQUEST TO /friends')

    let { authorization: token } = req.headers;
    try{
        let { userid } = jwt.verify(token, signature);
        console.log(userid)
        // let friends
        db.one(`
            SELECT friendsarray FROM friends
            WHERE userid = '${userid}';
        `)
        .then( (friends) => {
            console.log('friends', friends)
            res.end(friends.friendsarray)
        })

    } catch(err) {
        console.log(err)
        res.end(JSON.stringify([]))
    }
})

router.post('/feed', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /feed')

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
            WHERE ${query}
            ORDER BY checkins.created DESC;
    `)

    res.end(JSON.stringify(feed));
})


router.post('/getMyGoals', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /getMyGoals')


    let userId = await readBody(req).then( req => JSON.parse(req))
    console.log('goals', userId)
    db.query(`
        SELECT goalname, description,
        deadline, created, punishment, goalid
        FROM goals
        WHERE goals.userid = '${userId}';

    `).then( goals => res.end(JSON.stringify(goals)) )

})

router.post('/getMyCheckins', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /getMyCheckins')


    let userId = await readBody(req).then( req => JSON.parse(req));
    console.log('##### checkins userId', userId)
    db.query(`
        SELECT
        checkins.image, checkins.description, checkins.created
        FROM checkins
            JOIN goals
                ON goals.goalid = checkins.goalid
            WHERE goals.userid = '${userId}'
            ORDER BY checkins.created DESC;
    `)
    .then(checkins => {
        res.end(JSON.stringify(checkins));
    })
    .catch(error => {
        console.log(error); 
    });
})


router.post('/getMyFriends', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /getMyFriends')


    let userId = await readBody(req).then( req => JSON.parse(req))
    db.query(`
        SELECT friends.friendsarray
        FROM friends
        WHERE friends.userid = '${userId}';
    `)
    .then(data => JSON.parse(data[0].friendsarray))
    .then(async (array) => {

        let query = '';
        array.forEach( (friendId, i) => {
            query += `users.userid = '${friendId}' `;
            if ( i !== array.length - 1) query += 'OR ';
        })
    
        let feed = await db.query(`
            SELECT users.username,
            users.avatar, users.userid
            FROM users
                WHERE ${query};
        `)
        
        res.end(JSON.stringify(feed));
    })

})


router.post('/getUser', async (req, res) => {
    console.log('##### GETTING USER, /getUser')
    let userId = await readBody(req).then( req => JSON.parse(req));//req.body;
    console.log( '##### USERID', userId)
    db.one(`
        SELECT avatar, username, userid
        FROM users
        WHERE userid = '${userId}';
    `)
    .then(user => {
        console.log(' ##### /getUser, SENDING USER', user)
        res.end(JSON.stringify(user))
    })
})

  
router.post('/postCheckin', async (req, res) => {
    let checkin = await readBody(req).then( req => JSON.parse(req));
    let {goalid, image, description} = checkin;
    db.query(`
        INSERT INTO checkins VALUES(
            '${goalid}',
            '${image}',
            '${description}',
            '${new Date().toISOString()}'
        );
    `)
    .then( () => res.end())
    .catch(error => {
        console.log(error); 
    });

})

router.post('/searchFriends',  (req,res) => {
    console.log( '##### GETTING REQUEST TO /searchFriends')


    readBody(req)
    // .then( req => JSON.parse(req))
    .then( (username) => {
        db.query(`SELECT userid, username, avatar 
        FROM users 
        WHERE users.username ILIKE '${username}';`)
        .then( (users) => res.end(JSON.stringify(users)))
    })
})

router.post('/addFriend', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /addFriend')


    let info = await readBody(req).then( req => JSON.parse(req))
    // console.log(newFriendsArr)
    db.query(`
        DELETE FROM friends 
        WHERE userid = '${info.userid}';
    `)
    .then( () => {
        db.query(`
            INSERT INTO friends VALUES(
                '${info.userid}',
                '${info.friendsarray}'
            );
        `)
        .then( console.log)
    })
})

module.exports = router;

