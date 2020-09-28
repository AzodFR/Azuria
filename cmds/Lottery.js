const fs = require('fs');
const { MessageEmbed, ReactionCollector } = require('discord.js');
module.exports = {
    name: "lottery",
    alias: ["ltr"],
    description: "Start a lottery",
    async execute(message, args){

        const guild_id = message.guild.id;
        const player_id = message.author.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coins = server_data[guild_id].money

        if(args.length != 2){
            message.reply("you need to set the bet → $lottery x");
            return;
        }else if(isNaN(args[0]) || isNaN(args[1] || parseInt(args[0]) == 0 || parseInt(args[1]) <2)){
            message.reply("you need to set the bet and number of players → $lottery x y");
            return;
        }else{
            var list_player = [player_id];
            var list_player_name = [message.author.username]
            const max_p = parseInt(args[1])
            const prize = parseInt(args[0]);
            var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
            if(users_data[guild_id][player_id].money < prize){
                message.reply(`you don't have enough ${coins}`)
                return;
            }
            users_data[guild_id][player_id].money -= prize;
            saveCoins(users_data);
            message.channel.send(getEmbed(message, list_player, prize, coins, list_player_name, max_p)).then(m => {
                m.react("✅");
                const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot && user.id != message.author.id;
                const collector = m.createReactionCollector(filter);
                collector.on("collect", (reaction, user) => {
                    users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                    if(users_data[guild_id][user.id].money < prize){
                        m.channel.send(user.username+` you don't have enough ${coins} !`)
                    }else{
                        users_data[guild_id][user.id].money -= prize;
                        saveCoins(users_data);
                        list_player.push(user.id);
                        list_player_name.push(user.username);
                        m.edit(getEmbed(message, list_player, prize, coins,list_player_name, max_p));
                        if(list_player.length >= max_p){
                            const victory = getRandomInt(list_player.length);
                            m.reactions.removeAll()
                            users_data[guild_id][list_player[victory]].money += prize*list_player.length;
                            saveCoins(users_data);
                            message.channel.send(list_player_name[victory] + " win the lottery and "+(prize*list_player.length)+` ${coins}`)
                            collector.stop();
                        }
                    }
                });
                collector.on("dispose", (reaction,user)=>{
                    users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                    users_data[guild_id][user.id].money += prize
                    saveCoins(users_data);
                    list_player.pop(user.id);
                    list_player_name.pop(user.username)
                })
            })
        }
    }
}

function getEmbed(message, list_player, prize, coins,list_player_name, max_p){
    var embed = new MessageEmbed()
                .setTitle("The Grand Lottery 💎")
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription('-----------------')
                .setColor("BLUE")
                .setURL("https://github.com/AzodFR/Azuria/")
                .addField(`Participants (${list_player.length}/${max_p})`, list_player_name, true)
                .addField("Entry:", `${prize} ${coins}`, true)
                .addField("Prize", `${prize*list_player.length} ${coins}`, true)
                .setFooter("Lottery started by "+message.author.username);
    return embed;
}
function saveCoins(json){
    fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
        if (err) console.error(err)
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }