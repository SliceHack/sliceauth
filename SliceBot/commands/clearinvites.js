const fs = require('fs')

const JSONdb = require('simple-json-db');

module.exports = {
    name: 'clearinvites',
    async execute(client, message, args) {
        const member = message.member;
        if (!member.roles.cache.has('985380805310292018')) return message.reply('You do not have the required role to use this command!');
        const db = new JSONdb('invitekeys.json');
        await db.JSON({});
        await message.reply('Successfully cleared all invites!');
    },
};