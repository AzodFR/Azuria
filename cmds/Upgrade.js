const fs = require('fs')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "upgrade",
    alias: ["up"],
    description: "Open the menu of upgrades",
    async execute(message, args, client){
        const author = message.author;
        const guild_id = message.guild.id;
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));
        const coin = server_data[guild_id].money
        message.channel.send(getEmbed(author, guild_id, coin, client)).then(m => {
            loop(m, author, guild_id, coin, client);
        })
    }
}

function loop(m, author, guild_id, coin, client){
    m.react('🔋');
    const filter = (reaction, user) => reaction.emoji.name === '🔋' && !user.bot && user.id === author.id;
    const collector = m.createReactionCollector(filter, {max:1, time: 15000});
    collector.on('collect', (reaction, user) => {
        if(!checkPrice(author.id, guild_id)){
            m.edit("You don't have enough "+coin).then(async ch => {
                ch.delete({ timeout: 5000 })
            })
            m.reactions.removeAll()
            collector.stop()
            return;
        }else{
            boostLevelUp(author.id, guild_id)
            m.reactions.removeAll()
            collector.stop()
            m.channel.send("You success fully up to Boost Level "+getBoostLevel(author.id, guild_id)).then(async ch => {
                ch.delete({ timeout: 5000 })
            })
            m.edit(getEmbed(author, guild_id, coin, client)).then(c => {
                loop(c, author, guild_id, coin, client);
            })
            
        }

    })

    collector.on('end', collected => {
        if(m){
            m.reactions.removeAll();
        }
    });
}

function getEmbed(author, guild_id, coin, client){

    var boost_level = getBoostLevel(author.id, guild_id);
    var boost_price = (boost_level+1)*200
    const embed = new MessageEmbed()
        .setTitle("Upgrade Menu")
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription('-----------------')
        .setColor("BLUE")
        .setURL("https://github.com/AzodFR/Azuria/")
        .addField(`🔋 Boost → Level ${boost_level+1}`, boost_price+' '+coin)
        .setThumbnail('https://i.imgur.com/DKdczRO.png')
    return embed;
}

function getBoostLevel(author_id, guild_id){
    var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    return users_data[guild_id][author_id].boost;
}

function getMoney(author_id, guild_id){
    var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    return users_data[guild_id][author_id].money;
}

function checkPrice(author_id, guild_id){
    var boost_level = getBoostLevel(author_id, guild_id);
    var boost_price = (boost_level+1)*200;
    var money = getMoney(author_id, guild_id)
    return money >= boost_price;
}

function boostLevelUp(author_id, guild_id){
    var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
    users_data[guild_id][author_id].boost += 1
    users_data[guild_id][author_id].money -= (getBoostLevel(author_id, guild_id)+1)*200
    saveCoins(users_data)
}

function saveCoins(json){
    fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
        if (err) console.error(err)
    });
}