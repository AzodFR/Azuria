const fs = require('fs')
const Discord = require('discord.js');

module.exports = {
    name: "server-info",
    alias: ["si"],
    description: "Show the informations about the server variables",
    execute(message, args, client){

        const guild_id = message.guild.id;

        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));

        const amount_batk = server_data[guild_id].bank_atk_simple;
        const amount_bigwin = server_data[guild_id].bank_atk_bigwin;
        const coin = server_data[guild_id].money;
        const dev = server_data[guild_id].dev;

        const embed = new Discord.MessageEmbed()
                .setTitle("Server Information")
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription('-----------------')
                .setColor("BLUE")
                .setURL("https://github.com/AzodFR/Azuria/")
                .addField("Currency type:", coin)
                .addField("BankAttack Simple Reward", amount_batk)
                .addField("BankAttack Big Win", amount_bigwin)
                .setFooter("Dev mode is "+dev);
        message.channel.send(embed);
    }
}