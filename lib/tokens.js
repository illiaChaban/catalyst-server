const jwt = require('jsonwebtoken');


const signature = '1mm@_s5cur5_s11rv3r';

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