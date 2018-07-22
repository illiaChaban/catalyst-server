const readBody = require('../lib/readBody')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const moment = require('moment');
let {signature, createToken} = require('../lib/tokens');
let findUserByEmail = require('../lib/findUserByEmail');
const db = require('../db');
const Router = require('express').Router;
const router = new Router();

router.post('/login', async (req,res) => {
    let body = await readBody(req);
    let creds = JSON.parse(body);
    let { password, email  } = creds;
    let user = await findUserByEmail(db, email);
    let isValid;

    console.log('##### TRYING TO LOG IN')
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
    let userInfo = await readBody(req).then(data => JSON.parse(data))
    let {avatar, username,email,password} = userInfo
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

    console.log( 'USERID', typeof userid)

    await db.query(`
        INSERT INTO friends 
        ( userid, friendsarray ) 
        VALUES (
            '${userid}',
            '${JSON.stringify([])}'
        );
    `)
    // console.log('userid', userid)     
    let user = await findUserByEmail(db, email);
    console.log( "USER", user)
    let token = createToken(user[0]);
        res.end(token);
    
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


module.exports = router;