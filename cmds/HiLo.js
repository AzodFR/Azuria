const fs = require('fs');
const { ReactionCollector } = require("discord.js");
module.exports = {
    name: 'hilo',
    description: 'Launch a Hi-Lo Game',
    async execute(message, args){

        const guild_id = message.guild.id;
        const player_id = message.author.id
        var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coins = server_data[guild_id].money;
        if(args.length != 1){
            message.reply('the right command is $hilo x → x is your bet')
            return;
        }
        else if(isNaN(args[0])){
            message.reply('the right command is $hilo x → x is your bet')
            return;
        }else{
            var bet = parseInt(args[0]);
            if(bet > users_data[guild_id][player_id].money){
                message.reply(`you don't have enough ${coins} !`)
                return;
            }else if(bet == 0){
                message.reply(`you need to bet at least 1 ${coins} !`)
                return;
            }
            else{
                users_data[guild_id][player_id].money -= bet;
                saveCoins(users_data);
                const number = getRandomInt(100);
                console.log(number)
                message.channel.send("React for: ⬆️ Higher / ⬇️ Lower than 50 (Random number from 0 to 100)").then(m => {
                    m.react('⬆️');
                    m.react('⬇️');
                    m.awaitReactions((reaction, user) => user.id === player_id && (reaction.emoji.name == "⬆️" || reaction.emoji.name == "⬇️"),
                    {max: 1}).then(collected => {
                        switch(collected.first().emoji.name){
                            case "⬆️":
                                if(number>50){
                                    users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                                    const boost = users_data[guild_id][player_id].boost
                                    const bonus = parseInt((boost/100)*bet)
                                    var level = users_data[guild_id][player_id].level
                                    var level_bonus = 0
                                    if(level>=10){
                                       level_bonus = parseInt(level/10)*5
                                    }
                                    users_data[guild_id][player_id].money += bet*2+bonus+level_bonus;
                                    m.reactions.removeAll();
                                    saveCoins(users_data);
                                    m.edit(`The number was ${number} ! You double your bet and win ${bet*2} + ${level_bonus} (level) + ${bonus} (boost) ${coins}`)
                                    break;
                                }else if(number<50){
                                    m.reactions.removeAll();
                                    m.edit(`The number was ${number} ! You loose ${bet} ${coins}`)
                                    break;
                                }else if(number==50){
                                    users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                                    users_data[guild_id][player_id].money += bet;
                                    saveCoins(users_data);
                                    m.reactions.removeAll();
                                    m.edit(`The number was ${number} ! You didn't loose your bet !`)
                                    break;
                                }
                            case "⬇️":
                                if(number<50){
                                    users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                                    const boost = users_data[guild_id][player_id].boost
                                    const bonus = parseInt((boost/100)*bet)
                                    var level = users_data[guild_id][player_id].level
                                    var level_bonus = 0
                                    if(level>=10){
                                       level_bonus = parseInt(level/10)*5
                                    }
                                    users_data[guild_id][player_id].money += bet*2+bonus+level_bonus;
                                    m.reactions.removeAll();
                                    saveCoins(users_data);
                                    m.edit(`The number was ${number} ! You double your bet and win ${bet*2} + ${level_bonus} (level) + ${bonus} (boost) ${coins}`)
                                    break;
                                }else if(number>50){
                                    m.reactions.removeAll();
                                    m.edit(`The number was ${number} ! You loose ${bet} ${coins}`)
                                    break;
                                }else if(number==50){
                                    users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                                    users_data[guild_id][player_id].money += bet;
                                    saveCoins(users_data);
                                    m.reactions.removeAll();
                                    m.edit(`The number was ${number} ! You didn't loose your bet !`)
                                    break;
                                }
                            default:
                                break;
                        }
                    })
                })
            }
        }
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
function saveCoins(json){
    fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
        if (err) console.error(err)
    });
}