const fetch = require('node-fetch');
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "instagram",
    alias: ['ig','insta'],
    description: "Retrieve information about IG Account",
    async execute(message, args){
        if(args.length != 1){
            message.reply("please provide 1 argument")
            return;
        }else{
            let url = `https://www.instagram.com/${args[0]}/?__a=1`
            let settings = { method: "Get" };
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    var username = json.graphql.user.username;
                    const profile_pic = json.graphql.user.profile_pic_url_hd;
                    const follower = json.graphql.user.edge_followed_by.count;
                    const following = json.graphql.user.edge_follow.count
                    const bio = json.graphql.user.biography;
                    const full_name = json.graphql.user.full_name;
                    const category = json.graphql.user.business_category_name;
                    const private = json.graphql.user.is_private;
                    const verified = json.graphql.user.is_verified;
                    if(private) username += " 🔒";
                    if(verified) username += " ☑️";
                    var embed = new MessageEmbed()
                            .setTitle(username)
                            .setThumbnail(profile_pic)
                            .setColor("BLUE");
                    if(full_name != "")embed.addField('Full Name', full_name);
                    if(bio != "")embed.addField('Biography', bio)
                    if(category != null)embed.setFooter(category);
                    embed.addField('Followers', follower, true)
                    embed.addField('Following', following,true);
                    
                    message.channel.send(embed)
                    
                });
        }
    }
}