const { prefix } = require('../settings.json')

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (message.author.bot) return;

    if (message.mentions.users.first()) {
      if (message.mentions.users.first().id == message.client.user.id) {
        message.reply(`How's it going baby :heart_eyes:`)
      }
    }
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()
    if (!message.client.commands.has(command)) return;
    try {
      message.client.commands.get(command).execute(message.client, message, args);
    } catch (error) {
      console.error(error)
      message.reply("There was an issue executing that command!");
    }
  },
};