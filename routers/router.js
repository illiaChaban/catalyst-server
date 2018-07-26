const readBody = require('../lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const moment = require('moment');
let {signature, createToken} = require('../lib/tokens');
let findUserByEmail = require('../lib/findUserByEmail');
const db = require('../db');
const Router = require('express').Router;
const router = new Router();



router.post('/goals', async (req,res) => {
    console.log( '#### ADDING GOAL')

    let {userid, title, description, deadline, punishment} = req.body;

    console.log(req.body)
    db.query(`
        INSERT INTO goals
        ( userid, goalname, description, deadline, created, punishment )
        VALUES (
            ${userid},
            '${title}',
            '${description}',
            '${deadline}',
            '${new Date().toISOString()}',
            '${punishment}'
        );
    `)
    .then( () => res.end() )
    .catch( err => {
        console.log(err)
        res.status(400).end()
    })

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
            WHERE userid = ${userid};
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

    // let friendsArr = await readBody(req).then(JSON.parse);
    let friendsArr = req.body;
    
    if (friendsArr.length) {
        let query = '';
        friendsArr.forEach( (friendId, i) => {
            query += `users.userid = ${friendId} `;
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
    } else {
        res.end(JSON.stringify([]))
    }

    
})



router.post('/getMyGoals', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /getMyGoals')

    // let userId = await readBody(req).then(JSON.parse);
    let userId = req.body;

    console.log('goals', userId)
    db.query(`
        SELECT goalname, description,
        deadline, created, punishment, goalid
        FROM goals
        WHERE goals.userid = ${userId};

    `)
    .then( goals => res.end(JSON.stringify(goals)) )
    .catch( console.log)

})
// router.use( bodyParser.json());


router.post('/getMyCheckins', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /getMyCheckins')

    // let userId = await readBody(req).then(JSON.parse);
    let userId = req.body;

    console.log('##### checkins userId', userId)
    db.query(`
        SELECT
        checkins.image, checkins.description, checkins.created
        FROM checkins
            JOIN goals
                ON goals.goalid = checkins.goalid
            WHERE goals.userid = ${userId}
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


    // let userId = await readBody(req).then(JSON.parse);
    let userId = req.body;

    db.one(`
        SELECT friends.friendsarray
        FROM friends
        WHERE friends.userid = ${userId};
    `)
    .then(data => JSON.parse(data.friendsarray))
    .then(async (friendsArr) => {
        if ( friendsArr.length ) {
            let query = '';
            friendsArr.forEach( (friendId, i) => {
                query += `users.userid = '${friendId}' `;
                if ( i !== friendsArr.length - 1) query += 'OR ';
            })
        
            let feed = await db.query(`
                SELECT users.username,
                users.avatar, users.userid
                FROM users
                    WHERE ${query};
            `)
            
            res.end(JSON.stringify(feed));
        } else {
            res.end(JSON.stringify([]))
        }

    })
    .catch( console.log )

})


router.post('/getUser', async (req, res) => {
    console.log('##### GETTING USER, /getUser')

    // let userId = await readBody(req).then(JSON.parse);
    let userId = req.body;

    console.log( '##### USERID', userId)
    db.one(`
        SELECT avatar, username, userid
        FROM users
        WHERE userid = ${userId};
    `)
    .then(user => {
        console.log(' ##### /getUser, SENDING USER', user)
        res.end(JSON.stringify(user))
    })
})

  
router.post('/postCheckin', async (req, res) => {

    // let checkin = await readBody(req).then(JSON.parse);
    let checkin = req.body;

    let {goalid, image, description} = checkin;
    db.query(`
        INSERT INTO checkins VALUES(
            ${goalid},
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


    let username = req.body

    db.query(`SELECT userid, username, avatar 
    FROM users 
    WHERE users.username ILIKE '${username}';`)
    .then( (users) => res.end(JSON.stringify(users)))
    .catch(console.log)
})



router.post('/addFriend', async (req,res) => {
    console.log( '##### GETTING REQUEST TO /addFriend')


    // let info = await readBody(req).then(JSON.parse);

    let info = req.body;

    // console.log(newFriendsArr)
    db.query(`
        DELETE FROM friends 
        WHERE userid = ${info.userid};
    `)
    .then( () => {
        db.query(`
            INSERT INTO friends VALUES(
                ${info.userid},
                '${info.friendsarray}'
            );
        `)
        .then( console.log)
    })
})

module.exports = router;

