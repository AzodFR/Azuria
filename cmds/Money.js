const fs = require('fs');

module.exports = {
    name: "money",
    description: "all economical commands",
    execute(message, args){

        const guild_id = message.guild.id;
        const guild_name = message.guild.name;
        const sender = message.author;
        const sender_id = sender.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coin = server_data[guild_id].money;

        var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        if(!users_data[guild_id]){
            users_data[guild_id] = {
                name: guild_name
            }
            fs.writeFileSync("./data/users.json", JSON.stringify(users_data), (err) => {
                if (err) console.error(err)
            });
        }
        if(!users_data[guild_id][sender_id]){
            users_data[guild_id][sender_id] = {
                username: sender.username,
                money: 0
            }
            fs.writeFileSync("./data/users.json", JSON.stringify(users_data), (err) => {
                if (err) console.error(err)
            });
        };

        message.channel.send(sender.username+" you have "+users_data[guild_id][sender_id].money+" "+coin+" !")

    }
}