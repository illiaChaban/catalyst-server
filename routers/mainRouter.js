const jwt = require('jsonwebtoken'),
      {signature} = require('../lib/tokens'),
      db = require('../db'),
      Router = require('express').Router,
      router = new Router();

      

router.post('/goals', async (req,res) => {
    let {userid, title, description, deadline, punishment} = req.body;
    console.log(punishment)
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
        console.log('#### ADD GOAL ERROR', err)
        res.status(400).end()
    })

})


router.get('/friends', async (req, res) => {
    let { authorization: token } = req.headers;
    try{
        let { userid } = jwt.verify(token, signature);
        db.one(`
            SELECT friendsarray FROM friends
            WHERE userid = ${userid};
        `)
        .then( (friends) => {
            res.end(friends.friendsarray)
        })

    } catch(err) {
        console.log('##### GETTING FRIENDS ERR', err)
        res.status(400).end('Unauthorized')
    }
})


router.post('/feed', async (req,res) => {
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
    let userId = req.body;

    db.query(`
        SELECT goalname, description,
        deadline, created, punishment, goalid
        FROM goals
        WHERE goals.userid = ${userId};

    `)
    .then( goals => res.end(JSON.stringify(goals)) )
    .catch( err => console.log('### GETTING MY GOALS ERR', err))
})


router.post('/getMyCheckins', async (req,res) => {
    let userId = req.body;

    db.query(`
        SELECT
        checkins.image, checkins.description, checkins.created
        FROM checkins
            JOIN goals
                ON goals.goalid = checkins.goalid
            WHERE goals.userid = ${userId}
            ORDER BY checkins.created DESC;
    `)
    .then(checkins => res.end(JSON.stringify(checkins)))
    .catch(err => console.log('### GET MY CHECKINS ERR', err));
})


router.post('/getMyFriends', async (req,res) => {
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
    .catch( err => console.log('### GET MY FRIENDS ERR', err) )
})


router.post('/getUser', async (req, res) => {
    let userId = req.body;

    db.one(`
        SELECT avatar, username, userid
        FROM users
        WHERE userid = ${userId};
    `)
    .then(user => res.end(JSON.stringify(user)))
    .catch( err => console.log('### GET USER ERR', err))
})

  
router.post('/postCheckin', async (req, res) => {
    let { goalid, image, description } = req.body;
    db.query(`
        INSERT INTO checkins 
        ( goalid, image, description, created )
        VALUES(
            ${goalid},
            '${image}',
            '${description}',
            '${new Date().toISOString()}'
        );
    `)
    .then( () => res.end())
    .catch(error => {
        console.log('### POST CHECKING ERR',error); 
        res.status(500).end()
    });

})

router.post('/searchFriends',  (req,res) => {
    let username = req.body

    db.query(`SELECT userid, username, avatar 
    FROM users 
    WHERE users.username ILIKE '%${username}%';`)
    .then( (users) => res.end(JSON.stringify(users)))
    .catch( err => console.log('### SEARCH FRIENDS ERR', err))
})



router.post('/updateFriends', async (req,res) => {
    let info = req.body;
    try {
        await db.query(`
            DELETE FROM friends 
            WHERE userid = ${info.userid};
        `)
        await db.query(`
            INSERT INTO friends VALUES(
                ${info.userid},
                '${info.friendsarray}'
            );
        `)
        res.end()

    } catch(err) {
        console.log('### ADD FRIEND ERR ', err)
        res.status(500).end()
    }
})

module.exports = router;

