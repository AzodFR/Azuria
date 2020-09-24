const Discord = require('discord.js');
const fs = require('fs');
const {token, prefix} = require('./config.json')

const client = new Discord.Client();

var games_data = JSON.parse(fs.readFileSync("./data/games.json", "utf-8"));
var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

client.commands = new Discord.Collection();
client.alias = new Discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log("Azuria is ready !");
    client.user.setPresence({
        activity: {
            name: `Connected on: ${length(games_data)} servers`,
        },
    })
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
    saveData(games_data, "games");
    saveData(users_data, "users");
    client.user.setPresence({
        activity: {
            name: `Connected on: ${length(games_data)} servers`,
        },
    })
    
})

client.on("guildDelete", guild => {
    delete games_data[guild.id]
    delete users_data[guild.id]
    saveData(games_data, "games");
    saveData(users_data, "users");
    client.user.setPresence({
        activity: {
            name: `Connected on: ${length(games_data)} servers`,
        },
    })
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

client.on('message', message => {
    if(!message.content.startsWith(prefix || message.author.bot)) return;
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

function length(obj) {
    return Object.keys(obj).length;
}

function getData(){
    JSON.parse(fs.readFileSync("./data/games.json", "utf-8"));
}

function getUsers(){
    JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
}

function saveData(data,type){
    fs.writeFileSync("./data/"+type+".json", JSON.stringify(data), (err) => {
        if (err) console.error(err)
    });
}

