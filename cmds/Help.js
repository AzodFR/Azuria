const fs = require('fs')
const Discord = require('discord.js');
module.exports = {
    name: "help",
    alias: ["h", "?"],
    description: "Display all the commands list",
    execute(message, args, client,prefix){

        

        var embed = new Discord.MessageEmbed()
                    .setTitle("List of commands")
                    .setAuthor(client.user.username, client.user.avatarURL())
                    .setDescription('-----------------')
                    .setColor("BLUE");
        client.commands.forEach(cmd => {
            var name = prefix+cmd.name;
            if(cmd.alias){
                name += " (or ";
                cmd.alias.forEach(al => {
                    name+= prefix+al+" | ";
                })
                name = name.slice(0,name.length-3);
                name += ")";
                
            } 
            var desc = cmd.description;
            embed.addField(name,desc,false);
        });
            
        message.channel.send(embed);
        
    }
}