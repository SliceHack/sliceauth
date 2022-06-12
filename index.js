//create a default express app with cookie parser and body parser
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const discordbot = require('./SliceBot/client.js');

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
var server = app.listen(3001, () => {
    console.log(`Listening on port ${server.address().port}`);
});