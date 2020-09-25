const fs = require('fs');
module.exports = {
    name: "dev",
    description: "Switch the dev mode (ADMIN ONLY)",
    execute(message, args){
        if(!message.member.hasPermission("ADMINISTRATOR")){
            message.reply("it's look like you are not an Administrator of this server !")
            return;
        }else{
            const guild_id = message.guild.id;
            const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
            var dev = server_data[guild_id].dev;
            switch(dev){
                case "on":
                    dev = "off";
                    break;
                case "off":
                    dev = "on";
                    break;
                default:
                    break;
            }
            server_data[guild_id].dev = dev;
            fs.writeFileSync("./data/config_servers.json", JSON.stringify(server_data, null, 4), (err) => {
                if (err) console.error(err)
            });
            message.channel.send("The developper mode is now "+dev)
            return;
        }
    }
}