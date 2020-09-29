const { meme } = require('memejs');
module.exports = {
    name: "meme",
    description: "Retrieve a meme from reddit",
    execute(message){
        meme('memes', function(err, data){
            message.channel.send("Meme asked by "+message.author.username,{files:[{
                attachment: data.url,
                name: data.title+'.jpg'
            }]})
        })
    }
}