const jwt = require('jsonwebtoken');
require( 'dotenv' ).config()

const signature = process.env.SIGNATURE;

let createToken = user =>
  jwt.sign(
    { userid: user.userid },
    signature,
    { expiresIn: '7d' }
  );


module.exports = {
    signature,
    createToken
};