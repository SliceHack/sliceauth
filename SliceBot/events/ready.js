let date;

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    //console.groupCollapsed('%c SHARD ', 'color: white; background-color: aqua;', 'Created Shard')
    date = new Date;
    console.groupCollapsed('%c CLIENT ', 'color: white; background-color:green', 'Logged In!')
        console.log(`Time: ${date.toTimeString()}`)
        console.log(`Bot User: ${client.user.tag}`)
        console.log(`Guilds: ${client.guilds.cache.size}`)
        console.log(`Users: ${client.users.cache.size}`)
        console.log(`Channels: ${client.channels.cache.size}`)
    console.groupEnd();
    client.user.setActivity("You look cute tn ;)");

  
    // iterate through all guilds
    // client.guilds.cache.forEach(guild => {
    //   // get the first channel in the guild which is a text channel
    //   const channel = guild.channels.cache.find(channel => channel.type === "GUILD_TEXT");
    //   console.log(channel)
    //   // generate an invite for the channel
    //   channel.createInvite().then(invite => console.log(`Created an invite with a code of ${invite.code}`))
    // });  
  },
};