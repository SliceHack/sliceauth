const { Server } = require('socket.io');

const JSONdb = require('simple-json-db');

module.exports = (server) => {
    const io = new Server(server);

    const usernames = [];

    io.on('connection', (socket) => {
        var discordName = "Unknown";
        var admin = false;
        var hardwareID = "-1";
        var username = "Anonymous";

        socket.on("connected", (...args) => {
            discordName = args[0];
            username = args[1];
            hardwareID = args[2];
            admin = hardwareID == "ZGpsZXYxMC4wYW1kNjQxMC4wV2luZG93cyAxMEM6XFVzZXJzXGRqbGV2QU1ENjQgRmFtaWx5IDIzIE1vZGVsIDggU3RlcHBpbmcgMiwgQXV0aGVudGljQU1EQU1ENjRBTUQ2NDIzMjM="
            || hardwareID == "TmljazEwLjBhbWQ2NDEwLjBXaW5kb3dzIDExQzpcVXNlcnNcTmlja0ludGVsNjQgRmFtaWx5IDYgTW9kZWwgMTQxIFN0ZXBwaW5nIDEsIEdlbnVpbmVJbnRlbEFNRDY0QU1ENjQ2Ng=="

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

            //remove lastusername from the array of usernames if it exists and add the new username
            if (lastusername) {
                var index = usernames.indexOf(lastusername + ":" + (!und ? discordName : undefined));
                if (index > -1) {
                    usernames.splice(index, 1);
                }
            }
            usernames.push(username + ":" + discordName);
            io.emit("usernameSet", JSON.stringify(usernames));
        });

        socket.on("message", (...args) => {
            var message = args[0];

            var check = message.replace(/\s+/g, '');
            if (check.length <= 0) {
                return;
            }

            if((discordName == "Unknown" || username == "Anonymous") || hardwareID == "-1") {
                socket.emit('connected', discordName, username);
                return;
            }
            io.emit("newMessage", discordName, message, username);
        })

        socket.on('broadcast', (...args) => {
            var message = args[0];

            if (admin) {
                io.emit("addMessage", message);
            }
        })

        socket.on("disconnect", () => {
            var index = usernames.indexOf(username + ":" + discordName);
            if (index > -1) {
                usernames.splice(index, 1);
            }
            io.emit("ircDisconnection", discordName, username);
            io.emit("usernameSet", usernames);
        })

        socket.on('keepAlive', () => {
            if((discordName == "Unknown" && username == "Anonymous") && hardwareID == "-1") {
                socket.emit('connected', discordName, username);
            }
        });

        setInterval(() => {
            socket.emit('keepAlive', 'keepAlive');
        }, 2000);
    });
}