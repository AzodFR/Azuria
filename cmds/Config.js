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
                        .addField("BankAttack Reward → $config batk_reward x", "x will be the new BankAttack moneybag's reward and need to be a number")
                        .addField("BankAttack BigWin → $config batk_bigwin x", "x will be the new BankAttack Big Win reward and need to be a number")
                        .addField("DailyReward Minimum → $config dr_min x", "x will be the new minimum DailyReward and need to be a number")
                        .addField("DailyReward Maximum → $config dr_max x", "x will be the new maxmimum DailyReward and need to be a number")
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