const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { config } = require('process');
module.exports = {
    name: "top",
    description: "Show the most richest player of the server",
    async execute(message, args){

        const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const guild_id = message.guild.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coins = server_data[guild_id].money

        var top = {};
        var top2 = []

        Object.keys(users_data[guild_id]).forEach(player => {
            var money = users_data[guild_id][player].money;
            var name = users_data[guild_id][player].username;
            if(money != undefined){
                top[name] = money
                top2.push([name, money])
            }    
        })
        top2.sort();
        var i = 1;
        while(i<Object.keys(top2).length){

            for(var j = 0; j < Object.keys(top2).length; j++){

                if(top2[Object.keys(top2)[i]][1]>top2[Object.keys(top2)[j]][1]){
                    var memory = top2[Object.keys(top2)[i]];
                    top2[Object.keys(top2)[i]] = top2[Object.keys(top2)[j]];
                    top2[Object.keys(top2)[j]] = memory;
                    j = Object.keys(top2).length;
                    break;
                }
            }

            i++;
        }
        var k = 1;
        while(k<Object.keys(top2).length){
            for(var i = 0; i < Object.keys(top2).length; i++){
                for(var j = 0; j < Object.keys(top2).length; j++){

                    if(top2[Object.keys(top2)[i]][1]>top2[Object.keys(top2)[j]][1]){
                        var memory = top2[Object.keys(top2)[i]];
                        top2[Object.keys(top2)[i]] = top2[Object.keys(top2)[j]];
                        top2[Object.keys(top2)[j]] = memory;
                        j = Object.keys(top2).length;
                        break;
                    }
                }
            }

            k++;
        }

        var embed = new MessageEmbed()
        .setTitle("Top Money")
        .setDescription('-----------------')
        .setColor("BLUE")
        .setURL("https://github.com/AzodFR/Azuria/")
        .setThumbnail("https://i.imgur.com/aXAfC9y.png")
        .setFooter(`The bank have ${users_data[guild_id]["758479575260594238"].money} ${coins}`, "https://i.imgur.com/BMc3rCn.png")
        var bot = 0;
        for(var j = 0; j <Object.keys(top2).length; j++){
            const player = message.guild.members.cache.find(us => us.user.username == top2[Object.keys(top2)[j]][0])
            const boost = users_data[guild_id][player.id].boost;
            if(player.id == "758479575260594238"){
                bot = 1;
            }else{
               embed.addField(`#${j+1-bot} ${top2[Object.keys(top2)[j]][0]}`, `${top2[Object.keys(top2)[j]][1]} ${coins} -- Boost Level ${boost}`) 
            }
            
        }

        message.channel.send(embed);
    }
}
