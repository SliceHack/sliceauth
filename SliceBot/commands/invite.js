const { MessageAttachment, MessageEmbed } = require("discord.js");

const JSONdb = require('simple-json-db');

module.exports = {
    name: 'invite',
    async execute(client, message, args) {
        //check if user has the role with id 985380805310292018
        const member = message.member;
        if (!member.roles.cache.has('985380805310292018')) return message.reply('You do not have the required role to use this command!');
        //check if the message has a mention
        if (!message.mentions.users.first()) return message.reply('Please mention a user to invite them to the client!');
        //get the user
        const user = message.mentions.users.first();
        let invitemessage = await message.reply('Sendng invite...');
        //generate a random string of characters and numbers
        const invitekey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const db = new JSONdb('invitekeys.json');
        db.set(invitekey, invitekey)
        //message the user


        const file = new MessageAttachment("files/SliceHWID.jar");

        const embed = new MessageEmbed()
            .setColor('ORANGE')
            .setTitle('Invite Key')
            .setDescription(`You have been invited to Slice Client. Please use the following key and your Discord ID(${user.id}) in the following executable file.\n\`\`\`` + invitekey + '\`\`\`')
        try {
            await user.send({ embeds: [embed], files: [file] });
        } catch(e) {return invitemessage.edit('This member has their dm\'s disabled!');}

        try {
            //convert user to guild member
            const guildMember = await message.guild.members.fetch(user.id);
            await guildMember.roles.add('985655219369177098');
        } catch (ignore) {}

        await invitemessage.edit(`Successfly sent an invite key to ${user.tag}`);
    },
  };