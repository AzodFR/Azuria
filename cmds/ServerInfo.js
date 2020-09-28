const fs = require('fs')
const {MessageEmbed} = require('discord.js')

module.exports = {
    name: "server-info",
    alias: ["si"],
    description: "Show the informations about the server variables",
    async execute(message, args, client){

        const guild_id = message.guild.id;

        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));

        const amount_batk = server_data[guild_id].bank_atk_simple;
        const amount_bigwin = server_data[guild_id].bank_atk_bigwin;
        const amount_drmin = server_data[guild_id].dailyreward_min;
        const amount_drmax = server_data[guild_id].dailyreward_max;
        const coin = server_data[guild_id].money;
        const dev = server_data[guild_id].dev;
        const basexp = server_data[guild_id].basexp;
        var welcome_channel = message.guild.channels.cache.get(ch => ch.id === server_data[guild_id].welcome);
        const regex = /[A-zÀ-ÿ]/g;
        if(server_data[guild_id].welcome.match(regex)){
            welcome_channel = await message.guild.channels.cache.find(ch => ch.name === server_data[guild_id].welcome);
       }else{
            welcome_channel = await message.guild.channels.cache.find(ch => ch.id === server_data[guild_id].welcome);
       }
        var footer_url = "";
        if(dev == "on"){
            footer_url = "https://www.clker.com/cliparts/g/o/B/T/y/X/glossy-green-button-md.png"
        }else{
            footer_url = "https://www.clker.com/cliparts/l/P/u/k/t/R/glossy-red-button-md.png"
        }

        const embed = new MessageEmbed()
                .setTitle("Server Information")
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription('-----------------')
                .setColor("BLUE")
                .setURL("https://github.com/AzodFR/Azuria/")
                .addField("Currency type", coin)
                .addField("Welcome Channel", welcome_channel.name)
                .addField("BankAttack Simple Reward", amount_batk)
                .addField("BankAttack Big Win", amount_bigwin)
                .addField("DailyReward Minimum Reward", amount_drmin)
                .addField("DailyReward Maximum Reward", amount_drmax)
                .addField("XP / message", basexp)
                .setFooter("Dev mode is "+dev, footer_url);
        message.channel.send(embed);
    }
}