const express = require('express'),
      http = require('http'),
      cors = require('cors'),
      path = require('path'),
      bodyParser = require('body-parser'),
      mainRouter = require('./routers/mainRouter'),
      authentificationRouter = require('./routers/authentificationRouter');

const app = express();
app.use(cors());
// app.use('/', express.static(path.join(__dirname, 'build')))
app.use( bodyParser.json() )
app.use( bodyParser.text() )

app.use('/authentication', authentificationRouter);
app.use('/api', mainRouter);

const server = http.createServer(app)

console.log('HTTP server running at http://localhost:5000');
server.listen(5000);