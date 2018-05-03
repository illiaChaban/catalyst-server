const express = require('express');
const http = require('http');
const cors = require('cors');
let router = require('./router');
// const urlencoded = require('body-parser').urlencoded;


const app = express();
// app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(router);

const server = http.createServer(app)

console.log('HTTP server running at http://localhost:5000');
server.listen(5000);