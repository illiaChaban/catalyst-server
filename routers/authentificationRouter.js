const jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      {signature, createToken} = require('../lib/tokens'),
      findUserByEmail = require('../lib/findUserByEmail'),
      db = require('../db'),
      Router = require('express').Router,
      router = new Router();



router.post('/login', async (req,res) => {

    let { password, email  } = req.body;
    let user = await findUserByEmail(db, email);
    
    let isValid;
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

    let {avatar, username,email,password} = req.body
    //default avatar
    if (!avatar) avatar = 'https://cdn.iconscout.com/public/images/icon/free/png-512/avatar-user-business-man-399587fe24739d5a-512x512.png';

    let hash = await bcrypt.hash(password,10);

    //add new user
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

    // get new user id
    let { userid } = await db.one(`
        SELECT userid FROM users
        WHERE passw = '${hash}';
    `).catch( console.log)

    // create friends array
    await db.query(`
        INSERT INTO friends 
        ( userid, friendsarray ) 
        VALUES (
            '${userid}',
            '${JSON.stringify([])}'
        );
    `).catch( console.log )

    let user = await findUserByEmail(db, email);
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
        .catch( console.log)

        res.end(JSON.stringify(me))
    } catch(err) {
        console.log(err)
        res.status(401).end('Unauthorized');
    }
})


module.exports = router;