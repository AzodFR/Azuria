const Discord = require('discord.js');
const fs = require('fs');
const { config } = require('process');
const {token, prefix} = require('./config.json')
const Canvas = require('canvas');

const client = new Discord.Client();

var games_data = JSON.parse(fs.readFileSync("./data/games.json", "utf-8"));
var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
var config_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));

client.commands = new Discord.Collection();
client.alias = new Discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log("Azuria is ready !");
    client.user.setActivity(`Connected on: ${length(games_data)} servers`);
    Object.keys(games_data).forEach(guild => {
        games_data[guild].bankatk = ""
    })
    saveData(games_data,"games");
})

client.on("guildCreate", guild => {
    games_data[guild.id] = {
        bankatk: ""
    };
    users_data[guild.id] = {
        name: guild.name
    };
    config_data[guild.id] = {
        money: "coins",
        bank_atk_simple: 10,
        bank_atk_bigwin: 100,
        dailyreward_min: 5,
        dailyreward_max: 20,
        basexp: 1,
        dev: "off",
        welcome: "general",
        levels: {}
    }
    for(var i = 1; i<=200; i++){
        config_data[guild.id].levels[i] = (5*(i+3))
    }
    saveData(games_data, "games");
    saveData(users_data, "users");
    saveData(config_data, "config_servers");
    client.user.setActivity(`Connected on: ${length(games_data)} servers`);
    
})

client.on("guildDelete", guild => {
    delete games_data[guild.id]
    delete users_data[guild.id]
    delete config_data[guild.id]
    saveData(games_data, "games");
    saveData(users_data, "users");
    saveData(config_data, "config_servers");
    client.user.setActivity(`Connected on: ${length(games_data)} servers`);
})

client.login(token);

for(const file of commandFiles){
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
    if(command.alias){
        command.alias.forEach(al => {
            client.alias.set(al, command);
        })
        
    } 
}

client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)){
        const guild_id = message.guild.id;
        const author_id = message.author.id;
        if(!users_data[guild_id][author_id]){
            users_data[guild_id][author_id] = {
                username: message.author.username,
                money: 0,
                xp: 0,
                level: 0,
                boost: 1
            }
            saveData(users_data, "users");
        }; 
        users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        config_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const boost = users_data[guild_id][author_id].boost;
        const basexp = config_data[guild_id].basexp;
        const level = users_data[guild_id][author_id].level;
        users_data[guild_id][author_id].xp += basexp*boost
        saveData(users_data, "users");
        const xp = users_data[guild_id][author_id].xp;
        if(xp >= config_data[guild_id].levels[level+1]){
            users_data[guild_id][author_id].level += 1;
            users_data[guild_id][author_id].xp = 0;
            message.reply(`you are now level ${level+1} !`)
            saveData(users_data, "users");
        }
        return;
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if(!(client.commands.has(command) || client.alias.has(command)))return;
    
    try{
        if(client.commands.has(command)){
            client.commands.get(command).execute(message, args, client, prefix);
        }else if(client.alias.has(command)){
            client.alias.get(command).execute(message, args, client, prefix);
        }
        
    }catch(error){
        console.error(error);
        message.reply("OOPS... An error occured");
    }

})


client.on("guildMemberAdd", async member => {
    config_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
    var welcome_channel = undefined;
    const regex = /[A-zÀ-ÿ]/g;
    if(config_data[member.guild.id].welcome.match(regex)){
         welcome_channel = member.guild.channels.cache.find(ch => ch.name === config_data[member.guild.id].welcome);
    }else{
         welcome_channel = member.guild.channels.cache.find(ch => ch.id === config_data[member.guild.id].welcome);
    }

    if(!welcome_channel) return;

    const canvas = Canvas.createCanvas(800,400);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('images/welcome.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '42px sans-serif';
	ctx.fillStyle = '#000000';
	ctx.fillText('Welcome to the server,', canvas.width / 3.8, canvas.height / 3);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#000000';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 200, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 100, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	welcome_channel.send(`Welcome to the server, ${member}!`, attachment);
})

setInterval(function(){
    const date = new Date().getMinutes();
    if(date%2==0){
        client.user.setActivity('type $help')
    }else{
        client.user.setActivity(`Connected on: ${length(games_data)} servers`)
    }
},10000)

function length(obj) {
    return Object.keys(obj).length;
}


function saveData(data,type){
    fs.writeFileSync("./data/"+type+".json", JSON.stringify(data, null, 4), (err) => {
        if (err) console.error(err)
    });
}

function applyText(canvas, text){
	const ctx = canvas.getContext('2d');
	let fontSize = 70;
	do {

		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);
	return ctx.font;
};