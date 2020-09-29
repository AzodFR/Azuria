const fs = require('fs')
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "pay",
    description: "Send money to other player",
    execute(message, args, client){
        const guild_id = message.guild.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coin = server_data[guild_id].money
        if(args.length != 2){
            message.reply("You need to mention a player and the amount → $pay @player x")
            return;
        }else if(message.mentions.users.first()){
            if(message.guild.members.cache.has(message.mentions.users.first().id)){
                const receiver = message.mentions.users.first().id;
                if(isNaN(args[1])){
                    message.reply("You need to mention a player and the amount → $pay @player x")
                    return;
                }else{
                   const sender = message.author.id;
                    const amount = parseInt(args[1])
                    if(amount == 0){
                        message.reply('you need to send at least 1 '+coin)
                        return;
                    }
                    const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                    if(users_data[guild_id][sender].money < amount){
                        message.reply(`you don't have enough ${coin} !`)
                        return;
                    }else{
                        users_data[guild_id][sender].money -= amount;
                        users_data[guild_id][receiver].money += amount;
                        saveCoins(users_data)
                        //message.channel.send(`<@${sender}> send ${amount} ${coin} to <@${receiver}>`)
                        const embed = new MessageEmbed()
                            .setTitle("Voucher of Bank")
                            .setAuthor(client.user.username, client.user.avatarURL())
                            .setDescription('-----------------')
                            .setColor("BLUE")
                            .setURL("https://github.com/AzodFR/Azuria/")
                            .addField(`${message.author.username} sent:`, `${amount} ${coin}`)
                            .addField(`${message.mentions.users.first().username} received:`, `${amount} ${coin}`)
                            .setThumbnail("https://i.imgur.com/wb8nVz8.png")
                        message.channel.send(embed)
                    }
                    
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