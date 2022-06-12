module.exports = {
    name: 'ping',
    async execute(client, message, args) {
        return message.reply(client.ws.ping + 'ms');
    },
  };