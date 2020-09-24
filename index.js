const Discord = require('discord.js');
const fs = require('fs');
const {token, prefix} = require('./config.json')

const client = new Discord.Client();

const games_data = JSON.parse(fs.readFileSync("./data/games.json", "utf-8"));
const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log("Azuria is ready !");
})

client.on("guildCreate", guild => {
    games_data[guild.id] = {
        bankatk: ""
    };
    users_data[guild.id] = {
        joined: true
    };
    fs.writeFileSync("./data/games.json", JSON.stringify(games_data), (err) => {
        if (err) console.error(err)
    });
    fs.writeFileSync("./data/users.json", JSON.stringify(users_data), (err) => {
        if (err) console.error(err)
    });
})

client.login(token);

for(const file of commandFiles){
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if(!message.content.startsWith(prefix || message.author.bot)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if(!client.commands.has(command)) return;
    try{
        client.commands.get(command).execute(message, args);
    }catch(error){
        console.error(error);
        message.reply("OOPS... An error occured");
    }
})

