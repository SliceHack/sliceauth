//create a default express app with cookie parser and body parser
const express = require('express');
const bodyParser = require('body-parser');
const http = require('node:http');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
require('./SliceBot/client.js');
require('./Socket/index.js')(server);

//setup the app to use cookie parser and body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setup router
var routerFiles = fs.readdirSync('./routes').filter(file => file.endsWith('.js'));
for(const file of routerFiles) {
    const router = require('./routes/' + file);
    let fileName = file.substring(0, file.length - 3);
    if (fileName == 'home') fileName = '';
    app.use('/' + fileName, router);
}

//start the server
server.listen(3001, function() {
    console.log('listening on *:' + this._connectionKey.substring(this._connectionKey.lastIndexOf(':') + 1));
});