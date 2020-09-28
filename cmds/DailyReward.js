const fs = require('fs')
module.exports = {
    name: "dailyreward",
    alias: ["dr"],
    description: "Give you a random amount of money (1/day)",
    execute(message,args){
        const guild_id = message.guild.id;
        const author_id = message.author.id;
        
        const games_data = JSON.parse(fs.readFileSync("./data/games.json", "utf-8"));
        const config_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const coin = config_data[guild_id].money;
        const min = config_data[guild_id].dailyreward_min;
        const max = config_data[guild_id].dailyreward_max;

        if(!users_data[guild_id][author_id]){
            users_data[guild_id][author_id] = {
                username: message.author.username,
                money: 0,
                xp: 0,
                level: 0,
                boost: 1
            }
            saveData("users", users_data);
        };    
        if(!games_data[guild_id][author_id]){
            games_data[guild_id][author_id]={
                name : message.author.username,
                dailyreward : Date.now()
            };
            saveData("games", games_data);
            getReward(min, max, users_data, guild_id, author_id, games_data, coin, message)
            return;
        }else if(!games_data[guild_id][author_id].dailyreward){
            games_data[guild_id][author_id]={
                name : message.author.username,
                dailyreward : Date.now()
            };
            saveData("games", games_data);
            getReward(min, max, users_data, guild_id, author_id, games_data, coin, message)
            saveData("users", users_data);
            return;
        }else{
            if(Date.now() < games_data[guild_id][author_id].dailyreward+(864*100000)){
                var time_left= new Date(games_data[guild_id][author_id].dailyreward+(864*100000)-Date.now()).toISOString().split('T')[1].split('.')[0].split(':')
                var time_left_string = "";
                if(time_left[0] != "00") time_left_string += time_left[0]+"h ";
                if(time_left[1] != "00" || time_left[0] != "00") time_left_string += time_left[1]+"m ";
                if(time_left[2] != "00") time_left_string += time_left[2]+"s";
                message.reply(`sorry but you need to wait ${time_left_string} seconds !`)
                return;
            }else{
                getReward(min, max, users_data, guild_id, author_id, games_data, coin, message)
                saveData("users", users_data);
                return;
            }
        }
    }
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function saveData(type, json){
    switch(type){
        case 'games':
            fs.writeFileSync("./data/games.json", JSON.stringify(json, null, 4), (err) => {
                if (err) console.error(err)
            });
            break;
        case 'users':
            fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
                if (err) console.error(err)
            });
            break;
        default:
            break;
    }
}

function getReward(min, max, users_data, guild_id, author_id, games_data, coin, message){
    const reward = getRandom(min, max);
    users_data[guild_id][author_id].money += reward;
    saveData("users", users_data)
    games_data[guild_id][author_id].dailyreward = Date.now()
    saveData("games", games_data);
    message.channel.send(`You win || ${reward} || ${coin} for daily reward :tada: !`)
}