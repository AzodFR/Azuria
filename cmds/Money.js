const fs = require('fs');

module.exports = {
    name: "money",
    description: "all economical commands",
    execute(message, args){

        const sender = message.author;
        const sender_id = sender.id;

        var users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

        if(!users_data[sender_id]){
            users_data[sender_id] = {
                money: 0
            }
            fs.writeFileSync("./data/users.json", JSON.stringify(users_data), (err) => {
                if (err) console.error(err)
            });
        };

        message.channel.send(sender.username+" you have "+users_data[sender_id].money+" coins !")

    }
}