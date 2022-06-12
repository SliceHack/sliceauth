const fs = require('fs')

module.exports = async function command (client, Collection) {

    client.commands = new Collection
    const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith
      ('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.name, command);
    }
    const date = new Date;

    console.groupCollapsed(`%c LOAD `, 'color: white; background-color: orange', 'Loaded Commands')
      console.log(`Time: ${date.toTimeString()}`)
      console.table(commandFiles)
    console.groupEnd();
}