# Catalyst - back end
[check out our front end](https://github.com/illiaChaban/Catalyst)


## Overview:
Motivational app for people that are lacking that extra push. Group of close friends post their goals that they want to commit to. Your friends vote for a ridiculous punishment for you if you don’t follow through. You have to ‘check-in’ to prove that you actually doing the work, else get punished!

##### ____Mobile first

#### Watch demo:

<a href="https://www.youtube.com/watch?v=hNMJl7z7fHQ&t=0s" target="_blank">
  <img src="https://user-images.githubusercontent.com/34459770/40567095-ed30773e-6041-11e8-8f5b-7ca37e535b02.png" height="150"/>
</a>

#### Screenshots:

<div>
  <img width="150" alt="sc1" src="https://user-images.githubusercontent.com/34459770/40567439-4d3d368e-6043-11e8-8020-3b4117b18a15.png">
  <img width="150" alt="sc2" src="https://user-images.githubusercontent.com/34459770/40567441-4e48135a-6043-11e8-8664-5ff0846c3382.png">
  <img width="150" alt="sc3" src="https://user-images.githubusercontent.com/34459770/40567443-4f8611a4-6043-11e8-9b78-344b3f87d693.png">
  <img width="150" alt="sc4" src="https://user-images.githubusercontent.com/34459770/40567445-5100a01c-6043-11e8-87c4-1f61dbd6efc5.png">
  <img width="150" alt="sc5" src="https://user-images.githubusercontent.com/34459770/40567447-5287d52c-6043-11e8-9a2a-b8d32976d130.png">

</div>



## Team Members & Roles:
* [Itzik Shaoulian](https://github.com/itzik415) "The soul of the team, obviously"
* [Aaron Gross](https://github.com/ponchieponcho) "Bruce Willis of the team"
* [Illia Chaban](https://github.com/illiaChaban) "Had to be motivated by the app to finish the app"


## Technologies used:
 * React 
 * PostgreSQL 
 * Redux
 * Express.js 
 * JavaScript
 * Node.js
 * CSS
 * Amazon EC2.


## Code snippets:

```javascript
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
    db.one(`
        SELECT avatar, username, userid
        FROM users
        WHERE userid = '${userId}';
    `)
    .then(user => {
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

```

