module.exports = {
    name: "ekip",
    alias: ["667", "freeze"],
    description: "Support for Freeze Corleone",
    execute(message, args){
        message.channel.send("S/O FREEZE").then(m => {
            m.react("🇸");
            m.react("🇴");
            m.react("🇪");
            m.react("🇰");
            m.react("🇮");
            m.react("🇵");
        })
    }
}