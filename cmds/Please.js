const fs = require('fs')
const { MessageEmbed } = require('discord.js');
const { timeStamp } = require('console');
module.exports = {
    name: "please",
    alias: ["pls"],
    description: "Ask for money to others player",
    execute(message, args, client){
        const guild_id = message.guild.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coin = server_data[guild_id].money
        if(args.length != 2){
            message.reply("You need to mention a player and the amount → $please @player x")
            return;
        }else if(message.mentions.users.first()){
            if(message.guild.members.cache.has(message.mentions.users.first().id)){
                const sender = message.mentions.users.first().id;
                if(isNaN(args[1])){
                    message.reply("You need to mention a player and the amount → $please @player x")
                    return;
                }else{
                    const receiver = message.author.id;
                    const amount = parseInt(args[1])
                    if(amount == 0){
                        message.reply('you need to send at least 1 '+coin)
                        return;
                    }
                    var embed = new MessageEmbed()
                    .setTitle("Invoice of Bank")
                    .setAuthor(client.user.username, client.user.avatarURL())
                    .setDescription('-----------------')
                    .setColor("BLUE")
                    .setURL("https://github.com/AzodFR/Azuria/")
                    .addField(`${message.author.username} ask ${message.mentions.users.first().username}:`, `${amount} ${coin}`)
                    .setThumbnail("https://i.imgur.com/vkyMFUw.png");
                    message.channel.send(embed).then(m => {
                        m.react("✅");
                        m.react('❌')
                    const filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌' ) && !user.bot && user.id === sender;
                    const collector = m.createReactionCollector(filter);
                    collector.on("collect", (reaction, user) => {
                        if(reaction.emoji.name == "✅"){
                            const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                            if(users_data[guild_id][sender].money < amount){
                                message.reply(`you don't have enough ${coin} !`)
                                return;
                            }else{
                                m.reactions.removeAll();
                                users_data[guild_id][sender].money -= amount;
                                users_data[guild_id][receiver].money += amount;
                                saveCoins(users_data)
                                var time = new Date()
                                var month = parseInt(time.getMonth())+1
                                if(month<10) month = "0"+month;
                                embed.setFooter(`Payed the ${time.getDate()}/${month}/${time.getFullYear()} at ${time.getHours()}:${time.getMinutes()}`, "https://i.imgur.com/AeeTCOx.png")
                                embed.setThumbnail("https://i.imgur.com/ZYPnkgC.png")
                                m.edit(embed);
                                collector.stop()
                            }
                        }else{
                            m.reactions.removeAll();
                            var time = new Date()
                            var month = parseInt(time.getMonth())+1
                            if(month<10) month = "0"+month;
                            embed.setFooter(`Refused the ${time.getDate()}/${month}/${time.getFullYear()} at ${time.getHours()}:${time.getMinutes()}`, "https://i.imgur.com/EGXevX5.png")
                            embed.setThumbnail("https://i.imgur.com/jfDEuFP.png")
                            m.edit(embed);
                            collector.stop()
                        }
                        
                        })
                    })
                }
            }
        }
    }
}

function saveCoins(json){
    fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
        if (err) console.error(err)
    });
}