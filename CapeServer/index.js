const Jimp = require('jimp');
const ColorThief = require('color-thief-jimp');
const https = require('https');
const fs = require('fs');

const map = new Map();

module.exports = (app, client) => {
    if(!fs.existsSync("./public/capes")) fs.mkdirSync("./public/capes");

    for(const file of fs.readdirSync("./public/capes")) {
        const username = file.split(".")[0];
        const url = `/capes/${file}`

        const cape = {
            username,
            url
        };
    
        map.set(username, cape);
    }

    app.get('/cape/:name', (req, res) => {
        const { name } = req.params;
        const cape = map.get(name);

        if (!cape) {
            return res.status(200).json({
                username: name,
                url: `${req.protocol}://${req.get('host')}/capes/slice/default.png`
            })
        }

        if(!fs.existsSync(`./public${cape.url}`)) {
            map.delete(name);

            return res.status(200).json({
                username: cape.username,
                url: `${req.protocol}://${req.get('host')}/capes/slice/default.png`
            })
        }

        return res.status(200).json({
            username: cape.username,
            url: `${req.protocol}://${req.get('host')}${cape.url}`
        });
    });

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
    
        const { content } = message;
    
        if(content.startsWith("=")) {
            const name = content.split("=")[1].split(" ")[0].toLowerCase();
            
            var tempMessage = null;
            switch (name) {
                case "uploadcape":
                    const username = message.author.id;
                    const attachment = message.attachments.first();
    
                    if(!attachment) return message.reply("Please upload a file.");
    
                    const url = attachment.url;
                    const extension = url.split(".").pop();
    
                    tempMessage = await message.channel.send("Downloading the file...");
    
                    if(extension !== "png" && extension !== "jpg" && extension !== "jpeg") return message.reply("Please upload an image.");
    
                    const file = fs.createWriteStream(`./public/capes/${username}.png`);
                    https.get(url, function(response) {
                       response.pipe(file);
                    
                       file.on("finish", () => {
                        file.close();
                        console.log("Download Completed");
    
                        combineImages("./cape.png", `./public/capes/${username}.png`, `./public/capes/${username}.png`, tempMessage)
    
                        // wait for the file to be updated
                        fs.watchFile(`./public/capes/${username}.png`, (curr, prev) => {
                            console.log("File updated.");
                            const cape = {
                                username,
                                url: `/capes/${username}.png`
                            };
                    
                            map.set(username, cape);
    
                            tempMessage.edit("Cape uploaded successfully.");
    
                            // make two delays to delete the messages
                            setTimeout(() => {
                                if(!tempMessage.deleted) {
                                    tempMessage.delete()
                                }
    
                                setTimeout(() => {
                                    if(!message.deleted) {
                                        message.delete()
                                    }
                                }, 1000);
                            }, 1000);
    
    
                            fs.unwatchFile(`./public/capes/${username}.png`);
                        });
                    })});
    
                    break;
                }
            }
    });
    
    function combineImages(file1, file2, output, message) {
        Promise.all([
            Jimp.read(file1),
            Jimp.read(file2)
          ])
          .then(images => {
            const image1 = images[0];
            const image2 = images[1];
          
            const combinedImage = image1.clone();
          
            var startX = 32, startY = 31,
                endX = 367, endY = 542,
                width = (endX - startX) + 3,
                height = (endY - startY) + 3;
            
            image2.resize(width, height);
            combinedImage.composite(image2, startX, startY);
    
            var dom = ColorThief.getColor(image2);
            
            var pixelCount = {
                white: 0,
                totalPixels: 0
            };
    
            image2.scan(0, 0, image2.bitmap.width, image2.bitmap.height, function (x, y, idx) {
                var red = this.bitmap.data[idx + 0];
                var green = this.bitmap.data[idx + 1];
                var blue = this.bitmap.data[idx + 2];
                var alpha = this.bitmap.data[idx + 3];
            
                // check if its a border pixel
                var thickness = 3;
                var border = (x < thickness || y < thickness || x > image2.bitmap.width - thickness || y > image2.bitmap.height - thickness);
    
                if(border) {
                    if ((red === 255 && green === 255 && blue === 255 && alpha === 255) || alpha == 0) {
                        pixelCount.white++;
                    }
    
                    pixelCount.totalPixels++;
                }
            });
    
    
            var areMostPixelsWhiteOrTransparent = pixelCount.white > pixelCount.totalPixels / 2;
            var dom = !areMostPixelsWhiteOrTransparent ? ColorThief.getColor(image2) : [255, 255, 255];
    
            combinedImage.scan(0, 0, combinedImage.bitmap.width, combinedImage.bitmap.height, function (x, y, idx) {
                var red = this.bitmap.data[idx + 0];
                var green = this.bitmap.data[idx + 1];
                var blue = this.bitmap.data[idx + 2];
                var alpha = this.bitmap.data[idx + 3];
    
                if(x >= startX && x <= endX && y >= startY && y <= endY) return;
                
                if (red === 0 && green === 0 && blue === 0 && alpha === 255) {
                    this.bitmap.data[idx + 0] = dom[0];
                    this.bitmap.data[idx + 1] = dom[1];
                    this.bitmap.data[idx + 2] = dom[2];
                    this.bitmap.data[idx + 3] = 255;
                }
            });
    
            combinedImage.write(output, err => {
              if (err) {
                console.error(err);
              } else {
                console.log('Images combined successfully!');
    
                if(message != null) {
                    message.edit("Images combined successfully!");
                }
              }
            });
          })
          .catch(err => {
            console.error(err);
          });
    }
                    
}