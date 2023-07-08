const { Client, Collection } = require('discord.js');
const client = new Client({ws: { properties: { $browser: "Discord iOS" }}, intents: 14079, allowedMentions: { repliedUser: false }});
const { token } = require('./settings.json')

const event = require('./eventHandler.js')
const command = require('./commandHandler.js')

module.exports = (app) => {
    command(client, Collection)
    event(client)
    
    require('../CapeServer/index.js')(app, client);

    client.login(token);
};