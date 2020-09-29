const fs = require('fs');
const Canvas = require('canvas');
const {MessageEmbed, MessageAttachment} = require('discord.js');
module.exports = {
    name:"roulette",
    alias: ["rol"],
    description: "Turn the roulette",
    async execute(message, args, client){

        const guild_id = message.guild.id;
        const player_id = message.author.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coins = server_data[guild_id].money
        if(args.length != 2){
            message.reply("you need to set the bet and number of players → $roulette x y");
            return;
        }else if(isNaN(args[0]) || isNaN(args[1] || parseInt(args[0]) == 0 || parseInt(args[1]) <2)){
            message.reply("you need to set the bet and number of players → $roulette x y");
            return;
        }else{
            var list_player = [player_id];
            var list_player_name = [message.author.username]
            const max_p = parseInt(args[1])
            const entry = parseInt(args[0])
            var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
            if(users_data[guild_id][player_id].money < entry){
                message.reply(`you don't have enough ${coins}`)
                return;
            }
            updatePrize(client, message.author, entry, guild_id)
            message.channel.send(getEmbed(message, list_player, entry, coins, list_player_name, max_p, client, guild_id)).then(m => {
                m.react("✅");
                const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot && user.id != message.author.id;
                const collector = m.createReactionCollector(filter);
                collector.on('collect', (reaction, user) => {
                    list_player.push(user.id);
                    list_player_name.push(user.username);
                    updatePrize(client, user, entry, guild_id)
                    m.edit(getEmbed(message, list_player, entry, coins, list_player_name, max_p, client, guild_id))
                    if(list_player.length >= max_p){
                        collector.stop();
                        m.reactions.removeAll();
                        const p_filter = ans => list_player.includes(ans.author.id);
                        var timer = 10
                        var intervalid = setInterval(function() {
                            if(timer>=0){
                                m.suppressEmbeds();
                                m.edit(`You have ${timer} secondes to pick a number between 0 and 25`);
                                timer--;
                            }else{
                                clearInterval(intervalid);
                            }
                            
                        }, 1000)
                        m.channel.awaitMessages(p_filter, {time: 10*1000, errors: ['time'] })
                        .then(collected => {console.log(collected)})
                        .catch(collected => {
                            var list_ans = []
                            collected.each(num => {
                                if(!isNaN(num.content)){
                                    var rep = parseInt(num.content);
                                    var id = list_player.indexOf(num.author.id);
                                    if(!list_ans[id]){
                                        list_ans[id]=rep;
                                    }
                                }
                            })
                                const result = getResult(message)
                                if(list_ans.includes(result)){
                                    const winner = list_ans.indexOf(result)
                                    const winner_id = list_player[winner];
                                    
                                    message.channel.send(`The winner is ${list_player_name[winner]} and he win ${getPrize(client, guild_id)} ${coins}`)
                                    winPrize(winner_id, guild_id, client);
                                }else{
                                    message.channel.send(`Nobody win ! All the ${coins} go to the bank !`)
                                }
                            
                        })
                    }
                })
            })
        }
            
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function getPrize(client, guild_id){
    var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    var prize = users_data[guild_id][client.user.id].money;
    return prize
}

function updatePrize(client, user, prize, guild_id){
    var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    users_data[guild_id][client.user.id].money += prize;
    users_data[guild_id][user.id].money -= prize;
    saveCoins(users_data)
}

function winPrize(winner_id, guild_id, client){
    var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    const prize = getPrize(client, guild_id);
    users_data[guild_id][client.user.id].money = 0;
    users_data[guild_id][winner_id].money += prize;
    saveCoins(users_data)
}

async function getResult(message){
    const result = getRandomInt(26);
    const canvas = Canvas.createCanvas(800,400);
    const ctx = canvas.getContext('2d');
    var before = 0;
    var after = 0
    var background = undefined
    if(result == 0){
         background = await Canvas.loadImage('./images/roulette_green.jpg');
        before = 25
        after = 1
    }else if(result%2 == 0){
         background = await Canvas.loadImage('./images/roulette_black.jpg');
        before = result-1;
        after = result +1
    }else{
        if(result == 1){
             background = await Canvas.loadImage('./images/roulette_red_1.jpg');
            before = result-1;
            after = result +1
        }else if(result == 25){
             background = await Canvas.loadImage('./images/roulette_red_25.jpg');
            before = result-1;
            after = 0;
        }else{
             background = await Canvas.loadImage('./images/roulette_red.jpg');
            before = result-1;
            after = result +1
        }
    }
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '92px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${result}`, canvas.width / 2.2 - 10, 150);

    ctx.font = '92px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${before}`, canvas.width / 5 - 60, 150);

    ctx.font = '92px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${after}`, canvas.width / 1.8 + 170 , 150);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'roulette.png');

    message.channel.send(`The number is ${result}!`, attachment);
    return result;
}


function getEmbed(message, list_player, prize, coins,list_player_name, max_p, client, guild_id){
    var embed = new MessageEmbed()
                .setTitle("Roulette ♻️")
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription('-----------------')
                .setColor("BLUE")
                .setThumbnail("https://i.imgur.com/SEgYOMV.jpg")
                .setURL("https://github.com/AzodFR/Azuria/")
                .addField(`Participants (${list_player.length}/${max_p})`, list_player_name, true)
                .addField("Entry:", `${prize} ${coins}`, true)
                .addField("Prize", `${getPrize(client, guild_id)} ${coins}`, true)
                .setFooter("Roulette started by "+message.author.username);
    return embed;
}

function saveCoins(json){
    fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
        if (err) console.error(err)
    });
}