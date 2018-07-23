const readBody = require('../lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const moment = require('moment');
let {signature, createToken} = require('../lib/tokens');
let findUserByEmail = require('../lib/findUserByEmail');
const db = require('../db');
const Router = require('express').Router;
const router = new Router();
const bodyParser = require('body-parser');

router.use( bodyParser.json())

router.post('/login', async (req,res) => {
    console.log('##### TRYING TO LOG IN')

    let creds = req.body;
    let { password, email  } = creds;
    let user = await findUserByEmail(db, email);
    let isValid;

    console.log('##### USER IS', user[0])

    if (user[0]){
      isValid = await bcrypt.compare(password, user[0].passw);
    }
    if (isValid) {
      let token = createToken(user[0]);
      res.end(token);
    } else {
      res.status(401).end('No token for you!');
    }

})

router.post('/register', async (req,res) => {
    console.log( '##### TRYING TO REGISTER')

    let {avatar, username,email,password} = req.body
    //default avatar
    if (!avatar) avatar = 'https://cdn.iconscout.com/public/images/icon/free/png-512/avatar-user-business-man-399587fe24739d5a-512x512.png';

    let hash = await bcrypt.hash(password,10);
    await db.query(`
        INSERT INTO users
        ( avatar, username, email, passw )
        VALUES (
                '${avatar}',
                '${username}',
                '${email}',
                '${hash}'
        );`)
        .catch(err => console.log(err)) 

    let { userid } = await db.one(`
        SELECT userid FROM users
        WHERE passw = '${hash}';
    `)

    console.log( '##### REGISTERED USERID', userid)

    await db.query(`
        INSERT INTO friends 
        ( userid, friendsarray ) 
        VALUES (
            '${userid}',
            '${JSON.stringify([])}'
        );
    `).catch( console.log )
    // console.log('userid', userid)     
    let user = await findUserByEmail(db, email);
    console.log( "USER", user)
    let token = createToken(user[0]);
        res.end(token);
    
})

router.get('/user/me', async (req,res) => {
    console.log('##### GETTING USER INFO - user/me')

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
        .catch( err => {
            console.log('##### USER/ME ERROR 1')
            console.log(err)
        })
        res.end(JSON.stringify(me))
    } catch(err) {
        console.log('##### USER/ME ERROR 2')
        console.log(err)
        res.status(401).end('Unauthorized');
    }
})


module.exports = router;