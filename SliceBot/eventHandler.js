const fs = require('fs')

module.exports = async function (client) {
    const eventFiles = fs.readdirSync(__dirname + '/events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    }
    const date = new Date;
    console.groupCollapsed(`%c LOAD `, 'color: white; background-color: orange', 'Loaded Events')
        console.log(`Time: ${date.toTimeString()}`)
        console.table(eventFiles)
    console.groupEnd();
}