const fs = require('fs');
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "config",
    description: "Edit server's variables (ADMIN ONLY)",
    execute(message, args, client){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            message.reply("it's look like you are not an Administrator of this server !")
            return;
        }else{
            if(args.length !=2 ){
                const embed = new MessageEmbed()
                        .setTitle("Configuration Help")
                        .setAuthor(client.user.username, client.user.avatarURL())
                        .setDescription('-----------------')
                        .setColor("BLUE")
                        .setURL("https://github.com/AzodFR/Azuria/")
                        .addField("List of arguments:", "You need to do $config argument value")
                        .addField("Currency → $config currency x", "x will be you new currency type")
                        .addField("Welcome Channel → $config welcome x", "x can be the exact name or the id of your welcoming channel")
                        .addField("BankAttack Reward → $config batk_reward x", "x will be the new BankAttack moneybag's reward and need to be a number")
                        .addField("BankAttack BigWin → $config batk_bigwin x", "x will be the new BankAttack Big Win reward and need to be a number")
                        .addField("DailyReward Minimum → $config dr_min x", "x will be the new minimum DailyReward and need to be a number")
                        .addField("DailyReward Maximum → $config dr_max x", "x will be the new maxmimum DailyReward and need to be a number")
                        .addField("Fast Reward → $config fast_reward x", "x will be the new Fast's reward and need to be a number")
                        .addField("Fast Timer → $config fast_timer x", "x will be the new Fast's timer and need to be a number")
                        .addField("Base XP → $config base_xp x", "x will be the amount of xp / message and need to be a number")
                        .setFooter("You can copy/paste the commands, don't forget to change x's value");
                message.channel.send(embed);
            }else{
                const guild_id = message.guild.id;
                const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));

                switch(args[0]){
                    case "currency":
                        server_data[guild_id].money = args[1];
                        message.channel.send("Success ! The new currency is the "+args[1])
                        break;
                    case "batk_reward":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].bank_atk_simple = parseInt(args[1]);
                            message.channel.send("Success ! The new BankAttack's reward is "+args[1])
                            break;
                        }
                    case "batk_bigwin":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].bank_atk_bigwin = parseInt(args[1]);
                            message.channel.send("Success ! The new BankAttack's big win is "+args[1])
                            break;
                        }
                    case "dr_min":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].dailyreward_min = parseInt(args[1]);
                            message.channel.send("Success ! The new minimum DailyReward is "+args[1])
                            break;
                        }
                    case "dr_max":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].dailyreward_max = parseInt(args[1]);
                            message.channel.send("Success ! The new maximum DailyReward is "+args[1])
                            break;
                        }
                    case "base_xp":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].basexp = parseInt(args[1]);
                            message.channel.send("Success ! The new amount of xp / message is "+args[1])
                            break;
                        }
                    case "fast_timer":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].fast_time = parseInt(args[1]);
                            message.channel.send("Success ! The new timer of Fast is "+args[1]+" seconds")
                            break;
                        }
                    case "fast_reward":
                        if(isNaN(args[1])){
                            message.reply("you need to put a number !")
                            return;
                        }else{
                            server_data[guild_id].fast_reward = parseInt(args[1]);
                            message.channel.send("Success ! The new reward of Fast is "+args[1])
                            break;
                        }
                    case "welcome":{
                            server_data[guild_id].welcome = args[1];
                            var welcome_c = undefined;
                            const regex = /[A-zÀ-ÿ]/g;
                            if(args[1].match(regex)){
                                welcome_c = message.guild.channels.cache.find(ch => ch.name === args[1]);
                            }else{
                                welcome_c = message.guild.channels.cache.find(ch => ch.id === args[1])
                            }
                            if(!welcome_c){
                                message.reply("this channel doesn't exist !")
                               return; 
                            } 
                            message.channel.send("Success ! Your new Welcoming Channel is <#"+welcome_c.id+">")
                            break;
                    }
                    default:
                        break;
                }
                fs.writeFileSync("./data/config_servers.json", JSON.stringify(server_data, null, 4), (err) => {
                    if (err) console.error(err)
                });
            }
        }
    }
}