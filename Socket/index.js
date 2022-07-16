const { Server } = require('socket.io');

const JSONdb = require('simple-json-db');

module.exports = (server) => {
    const io = new Server(server);

    const usernames = [];

    io.on('connection', (socket) => {
        var discordName;
        var username;

        socket.on("connected", (...args) => {
            discordName = args[0];
            username = args[1];
            hardwareID = args[2];

            var db = new JSONdb('accounts.json');
            var auth = false;
            
            if(db.has(hardwareID)) {
                auth = true;
            }

            if(!auth) {
                socket.disconnect();
                return;
            }

            usernames.push(username + ":" + discordName);

            io.emit("usernameSet", usernames)
            io.emit("ircConnection", discordName, username);
        })

        socket.on('setUsername', (...args) => {
            username = args[0];
            var lastusername = args[1];
            var discordName = args[2];
            var hardwareID = args[3];

            // if the discordname is undefined loop through the usernames array and find the discordname
            if(discordName == undefined) {
                for(var i = 0; i < usernames.length; i++) {
                    if(usernames[i].split(":")[0] == lastusername) {
                        discordName = usernames[i].split(":")[1];
                        break;
                    }
                }
            }

            //remove lastusername from the array of usernames if it exists and add the new username
            if (lastusername) {
                var index = usernames.indexOf(lastusername + ":" + discordName);
                if (index > -1) {
                    usernames.splice(index, 1);
                }
            }
            usernames.push(username + ":" + discordName);
            io.emit("usernameSet", JSON.stringify(usernames));
        });

        socket.on("message", (...args) => {
            var message = args[0];

            if(discordName == undefined) {
                socket.on("connected", (...args) => {
                    discordName = args[0];
                    username = args[1];
                    hardwareID = args[2];
        
                    var db = new JSONdb('accounts.json');
                    var auth = false;
                    
                    if(db.has(hardwareID)) {
                        auth = true;
                    }
        
                    if(!auth) {
                        socket.disconnect();
                        return;
                    }
        
                    usernames.push(username + ":" + discordName);
        
                    io.emit("usernameSet", usernames)
                    io.emit("ircConnection", discordName, username);
                });
                return;
            }

            io.emit("newMessage", discordName, message, username);
        })

        socket.on("disconnect", () => {
            //remove username from the array of usernames
            var index = usernames.indexOf(username + ":" + discordName);
            if (index > -1) {
                usernames.splice(index, 1);
            }
            io.emit("ircDisconnection", discordName, username);
            io.emit("usernameSet", usernames);
        })

        socket.on('keepAlive', () => {});

        setInterval(() => {
            socket.emit('keepAlive', 'keepAlive');
        }, 2000);
    });
}