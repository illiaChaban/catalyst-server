const readBody = require('./lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const moment = require('moment');
let {postTokens, signature} = require('./lib/tokens');
const db = require('./db');
const Router = require('express').Router;
const router = new Router();


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
        .then( () => postTokens(req,res,db))
        .catch(err => console.log(err))
        res.send('finished insert')
        
    })
})
})

router.post('/goals', (req,res) => {
    readBody(req).then( goal1 => {
        goal = JSON.parse(goal1)
        db.query(`
            INSERT INTO goals VALUES (
                '${goal.userid}',
                '${goal.title}',
                '${goal.description}',
                '${goal.deadline}',
                '${new Date().toISOString()}',
                '${goal.punishment}'
            );
        `)
        // .catch(error)
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
            WHERE ${query}
            ORDER BY checkins.created DESC;
    `)

    res.end(JSON.stringify(feed));
})

router.get('/user/me', async (req,res) => {
    let { authorization: token } = req.headers;
    try{
        let payload = jwt.verify(token, signature);
        let me = await db.one(`
            SELECT users.username, users.userid, users.avatar,
            friends.friendsArray
            FROM users
                JOIN friends
                ON friends.userid = users.userid
            WHERE users.userid = '${payload.userid}';
        `)
        res.end(JSON.stringify(me))
    } catch(err) {
        console.log(err)
        res.status(401).end('Unauthorized');
    }
})

router.post('/getMyGoals', async (req,res) => {
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
    let userId = await readBody(req).then( req => JSON.parse(req));
    console.log('checkins', userId)
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
    let userId = await readBody(req).then( req => JSON.parse(req));
    console.log('getting User', userId)
    db.one(`
        SELECT avatar, username, userid
        FROM users
        WHERE userid = '${userId}';
    `)
    .then(user => {
        res.end(JSON.stringify(user))
    })
})


// router.post('/addFriend',  (req,res) => {
//     readBody(req)
//     .then( req => JSON.parse(req))
//     .then( (json) => {
//         db.query(`SELECT users.email 
//         FROM users 
//         WHERE users.email = '${json.search}';`)
//         .then(console.log)
//     })
// })
  
router.post('/postCheckin', async (req, res) => {
    let checkin = await readBody(req).then( req => JSON.parse(req));
    console.log(checkin)
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
    readBody(req)
    // .then( req => JSON.parse(req))
    .then( (username) => {
        console.log(username)
        db.query(`SELECT userid, username, avatar 
        FROM users 
        WHERE users.username = '${username}';`)
        .then( (users) => res.end(JSON.stringify(users)))
    })
})

router.post('/addFriend', async (req,res) => {
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

