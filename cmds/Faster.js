const fs = require('fs');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "fast",
    description: "Solve the calcul as fast as you can",
    execute(message, args){
        if(args.length != 1){
            message.reply('you need to set the number x of player → $fast x')
            return;
        }else if(isNaN(args[0])){
            message.reply('you need to set the number x of player → $fast x')
            return;
        }else{
            const nb_players = parseInt(args[0]);
            if(nb_players < 2){
                message.reply('you must play with 1 other player → $fast x')
            return;
            }
            var players = [message.author.id];
            var players_name = [message.author.username];
            message.channel.send(getEmbed(message, nb_players, players, players_name)).then(m => {
                m.react("✅");
                const filter = (reaction, user) => reaction.emoji.name === '✅' && !user.bot && user.id != message.author.id;
                const collector = m.createReactionCollector(filter, {max: nb_players});

                collector.on('collect', (reaction, user) => {
                    players.push(user.id)
                    players_name.push(user.username)
                    m.edit(getEmbed(message, nb_players, players, players_name))
                    if(players.length>= nb_players){
                        m.reactions.removeAll();
                        var a = getRandomInt(50)
                        var b = getRandomInt(50)
                        const sign = ['+', '-', '*', '/']
                        const get_sign = sign[getRandomInt(4)]
                        var answer = 0;
                        var calcul = "";
                        switch (get_sign){
                            case '+':
                                answer = a + b
                                calcul = `There is the calcul: ${a} + ${b}`
                                break;
                            case '-':
                                answer = a - b
                                calcul = `There is the calcul: ${a} - ${b}`
                                break;
                            case '*':
                                answer = a * b
                                calcul = `There is the calcul: ${a} * ${b}`
                                break;
                            case '/':
                                
                                while((a/b)%2 != 0){
                                     a = getRandomInt(50)
                                     b = getRandomInt(50)
                                }
                                calcul = `There is the calcul: ${a} / ${b}`
                                answer = a /b
                                break;
                            default:
                                break;
                        }
                        m.channel.send(calcul).then(calc => {

                            var winner = ""
                            const p_filter = ans => players.includes(ans.author.id);
                            const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
                            const timer = server_data[m.guild.id].fast_time
                            calc.channel.awaitMessages(p_filter, {time: timer*1000, errors: ['time'] })
                            .then(collected => {
                                console.log(collected+'----')
                                })
                            .catch(collected => {
                                collected.each(msg => {
                                    var answer_p = msg.content
                                    if(!isNaN(answer_p)){
                                        if(answer_p.includes('.')){
                                            answer_p = parseInt(answer_p)
                                        }else{
                                            answer_p = parseInt(answer_p)
                                        }
                                        if(winner == "" && answer_p === answer){
                                            const guild_id = msg.guild.id;
                                            const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
                                            const coins = server_data[guild_id].money
                                            const reward = server_data[guild_id].fast_reward
                                            const boost = users_data[guild_id][msg.author.id].boost
                                            const bonus = parseInt((boost/100)*reward)
                                            var level = users_data[guild_id][msg.author.id].level
                                            var level_bonus = 0
                                            if(level>=10){
                                               level_bonus = parseInt(level/10)*5
                                            }
                                            winner = msg.author.id
                                            msg.channel.send(`The winner is ${msg.author.username} ! He win ${reward} + ${level_bonus} (level) + ${bonus} (boost) ${coins} !`)
                                            users_data[guild_id][winner].money += reward+bonus+level_bonus
                                            saveCoins(users_data)
                                            return;
                                        }
                                    }
                                })
                                if(winner == ""){
                                    calc.channel.send(`You are too slow the answer is ${answer}, nobody win !`)
                                }
                            });
                        })
                    }
                })
            })
        }
    }
}

function getEmbed(message, nb_players, players, players_name){
    const embed = new MessageEmbed()
    .setTitle("Fast Caclulating Game")
    .setAuthor(message.author.username, message.author.avatarURL())
    .setDescription('-----------------')
    .setColor("BLUE")
    .setURL("https://github.com/AzodFR/Azuria/")
    .addField(`Participants (${players.length}/${nb_players})`, players_name, true)
    .setFooter("Game started by "+message.author.username);
    return embed
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  function saveCoins(json){
    fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
        if (err) console.error(err)
    });
}