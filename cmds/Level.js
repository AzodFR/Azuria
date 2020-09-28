const fs = require('fs');
const Canvas = require('canvas');
const {MessageEmbed, MessageAttachment} = require('discord.js')
module.exports = {
    name: "level",
    description: "Give level on the server",
    async execute(message,args, client){

        const guild_id = message.guild.id;
        var author = message.author;

        const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));

        if(args.length == 1){
            if(message.mentions.users.first()){
               if (client.guilds.cache.get(guild_id).members.cache.has(message.mentions.users.first().id)){
                    author = message.mentions.users.first();
                    if(!users_data[guild_id][author.id]){
                     users_data[guild_id][author.id] = {
                            username: author.username,
                            money: 0,
                            xp: 0,
                            level: 0,
                            boost: 1
                        }
                        saveData(users_data, "users");
                    }; 
                } 
            }
            else{
                message.reply("please mentions an user !")
                return;
            }
        }

        const xp = users_data[guild_id][author.id].xp;
        const level = users_data[guild_id][author.id].level;
        const xp_next = server_data[guild_id].levels[level+1];
        const to_lvl = (100-(xp*100/xp_next))*443/100;
        const canvas = Canvas.createCanvas(600,200);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('./images/progress_bar.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = applyText(canvas, `${author.username}!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${author.username}`, canvas.width / 2.8, 65);

        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Level: ${level}`, canvas.width / 4, 95);

        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Experience: ${xp}/${xp_next}`, canvas.width / 2, 95);

        ctx.fillStyle = '#00093F'
        ctx.fillRect(536, 104, -(to_lvl), 50);

        ctx.beginPath()
        ctx.lineWidth="5";
        ctx.strokeStyle="#254960";
        ctx.moveTo(90,104)
        ctx.lineTo(507,104)
        ctx.arcTo(550, 128, 507, 150,25);
        ctx.lineTo(92,150)
        ctx.arcTo(50, 127, 100, 100,25);
        ctx.stroke();
        message.channel.send({files: [{
                                    attachment: canvas.toBuffer(),
                                    name: 'level_image.jpg'
                                    }]
        });


    }
}

function applyText(canvas, text){
	const ctx = canvas.getContext('2d');
	let fontSize = 70;
	do {

		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 100);
	return ctx.font;
};