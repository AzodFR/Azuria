module.exports = {
    name: "join",
    description: "Simulate member joining server",
    execute(message, args, client){
        const guild_id = message.guild.id
        if(args.length == 1){
            if(message.mentions.members.first()){
               if (client.guilds.cache.get(guild_id).members.cache.has(message.mentions.members.first().id)){
                    client.emit('guildMemberAdd', message.mentions.members.first());
               }
            }
        }
    }
}