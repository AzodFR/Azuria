const { ReactionCollector } = require("discord.js");
const fs = require("fs");
module.exports = {
    name: 'bankatk',
    alias: ['batk'],
    description: 'Start a Bank Attack game',
    execute(message, args, client) {

        //GET PLAYER INFOS & OTHER VARS
        const player = message.author;
        const player_id = player.id;
        const guild_id = message.guild.id;
        const guild_name = message.guild.name;
        
        const games_data = JSON.parse(fs.readFileSync("./data/games.json", "utf-8"));
        const users_data = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const server_data = JSON.parse(fs.readFileSync("./data/config_servers.json", "utf-8"));

        const amount_batk = server_data[guild_id].bank_atk_simple;
        const amount_bigwin = server_data[guild_id].bank_atk_bigwin;
        const coin = server_data[guild_id].money;
        const dev = server_data[guild_id].dev;
       
        

        if(games_data[guild_id].bankatk == ""){
            games_data[guild_id].bankatk = message.id;
            saveData("games", games_data);
            if(!users_data[guild_id]){
                users_data[guild_id] = {
                    name: guild_name
                }
                saveData("users", users_data);
            }
            if(!users_data[guild_id][player_id]){
                users_data[guild_id][player_id] = {
                    username: player.username,
                    money: 0
                }
                saveData("users", users_data);
            };    
        }else{
            return message.channel.send('A game is already started !');
        }

        var started_m = null;

        //TITLE MESSAGE
        message.channel.send(`Party started by ${player.username}`).then(m => {
            m.react('⛔');
            m.awaitReactions((reaction, user) => user.id == player_id && reaction.emoji.name == "⛔",
            { max: 1}).then(collected => {
                m.delete();
                message.delete();
                games_data[guild_id].bankatk = "";
                saveData("games", games_data);
                m.channel.messages.cache.get(started_m.id).delete();
            }).catch(() => {
                return;
            })
        })

        //GENERATING SYSTEM
        var bombs = [];
        var line_a = [];
        var line_b = [];
        var line_c = [];
        var line_d = [];
        var line_e = [];
        var clicked_a = [];
        var clicked_b = [];
        var clicked_c = [];
        var clicked_d = [];
        var clicked_e = [];

        //HOW MANY BOMBS PER LINE
        for(var i = 0; i<5; i++){
            bombs[i] = getRandomInt(5);
            const construct = []
            //AT WHAT POSITION DOES WE HAVE BOMBS
            for(var j = 0; j<=bombs[i]; j++){

                var place = getRandomInt(5)+1
                while(construct.includes(place)){
                    place = getRandomInt(5)+1
                }
                construct.push(place)

            }
            switch(i){
                case 0:
                    line_a = construct.sort();
                case 1:
                    line_b = construct.sort();
                case 2:
                    line_c = construct.sort();
                case 3:
                    line_d = construct.sort();
                case 4:
                    line_e = construct.sort();
                default:
                    break;
            }
        }

        //SENDING PATTERN

        const start_dev = `:regional_indicator_a: → :one::two::three::four::five: → ${line_a}\n`+
        `:regional_indicator_b: → :one::two::three::four::five: → ${line_b}\n`+
        `:regional_indicator_c: → :one::two::three::four::five: → ${line_c}\n`+
        `:regional_indicator_d: → :one::two::three::four::five: → ${line_d}\n`+
        `:regional_indicator_e: → :one::two::three::four::five: → ${line_e}\n`

        const start_no_dev = `:regional_indicator_a: → :one::two::three::four::five:\n`+
        `:regional_indicator_b: → :one::two::three::four::five:\n`+
        `:regional_indicator_c: → :one::two::three::four::five:\n`+
        `:regional_indicator_d: → :one::two::three::four::five:\n`+
        `:regional_indicator_e: → :one::two::three::four::five:\n`
        
        var start = "";

        if(dev == "on"){
            start = start_dev;
        }else{
            start = start_no_dev;
        }
        message.channel.send(start).then(started => {
             started_m = started;
             gameLoop(started,guild_id, player_id,line_a,line_b,line_c,line_d,line_e,clicked_a,clicked_b,clicked_c,clicked_d,clicked_e, games_data, users_data, amount_batk, amount_bigwin, coin)
        });
    },
};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function lineFinalConstructor(line, index){
    var string = "";
    switch(index){
        case "a":
            string = ":regional_indicator_a: → ";
            break;
        case "b":
            string = ":regional_indicator_b: → ";
            break;
        case "c":
            string = ":regional_indicator_c: → ";
            break;
        case "d":
            string = ":regional_indicator_d: → ";
            break;
        case "e": 
            string = ":regional_indicator_e: → ";
            break;
        default:
            break;
    }
    for(var i = 1; i<=5; i++){
        if(!line.includes(i)){
            string = string + ":moneybag:"
        }else{
            string = string + ":skull:"
        }
    }
    return string;
}

function finalConstructor(line_a,line_b,line_c,line_d,line_e,statut, amount_bigwin, coin){
    if( statut == "loose"){
        var string = lineFinalConstructor(line_a,"a")+"\n"+lineFinalConstructor(line_b,"b")+"\n"+lineFinalConstructor(line_c,"c")+"      -- YOU LOOSE"+"\n"+lineFinalConstructor(line_d,"d")+"\n"+lineFinalConstructor(line_e,"e");
    }else if( statut == "win"){
        var string = lineFinalConstructor(line_a,"a")+"\n"+lineFinalConstructor(line_b,"b")+"\n"+lineFinalConstructor(line_c,"c")+"      -- BIG WIN (+"+amount_bigwin+" "+coin+")"+"\n"+lineFinalConstructor(line_d,"d")+"\n"+lineFinalConstructor(line_e,"e");
    }
    return string;
}

function gameLoop(started, guild_id,player_id,line_a,line_b,line_c,line_d,line_e,clicked_a,clicked_b,clicked_c,clicked_d,clicked_e, games_data, users_data, amount_batk,amount_bigwin, coin){
    started.react('🇦');
    started.react('🇧');
    started.react('🇨');
    started.react('🇩');
    started.react('🇪');
    started.awaitReactions((reaction, user) => user.id == player_id && games_data[started.guild.id].bankatk != ""&& 
    (reaction.emoji.name == "🇦" || reaction.emoji.name == "🇧" ||reaction.emoji.name == "🇨" ||reaction.emoji.name == "🇩" ||reaction.emoji.name == "🇪" ),
    {max: 1}).then(collected => {
        var actual = []
        var click = []
        var line =""
        if(games_data[started.guild.id].bankatk == "") return;
        switch(collected.first().emoji.name){
        case "🇦":
            actual = line_a;
            click = clicked_a;
            line = "a"
            break;
        case "🇧":
            actual = line_b;
            click = clicked_b;
            line = "b"
            break;
        case "🇨":
            actual = line_c;
            click = clicked_c;
            line = "c"
            break;
        case "🇩":
            actual = line_d;
            click = clicked_d;
            line = "d"
            break;
        case "🇪":
            actual = line_e;
            click = clicked_e;
            line = "e"
            break;
        default:
            break;
        }
        started.reactions.removeAll();
        if(!click.includes(1)) started.react('1️⃣');
        if(!click.includes(2)) started.react('2️⃣');
        if(!click.includes(3)) started.react('3️⃣');
        if(!click.includes(4)) started.react('4️⃣');
        if(!click.includes(5)) started.react('5️⃣');
        started.awaitReactions((reaction, user) => user.id == player_id && 
    (reaction.emoji.name == "1️⃣" || reaction.emoji.name == "2️⃣" ||reaction.emoji.name == "3️⃣" ||reaction.emoji.name == "4️⃣" ||reaction.emoji.name == "5️⃣" ),
    {max: 1}).then(collected => {
        if(games_data[started.guild.id].bankatk == "") return;
        var choice = 0;
        switch(collected.first().emoji.name){
        case "1️⃣":
            choice = 1;
            break;
        case "2️⃣":
            choice = 2;
            break;
        case "3️⃣":
                choice = 3;
                break;
        case "4️⃣":
                choice = 4;
                break;
        case "5️⃣":
                choice = 5;
                break;
        default:
            break;
        }
        if(actual.includes(choice)){
            started.reactions.removeAll();
            started.edit(finalConstructor(line_a,line_b,line_c,line_d,line_e,"loose", amount_bigwin, coin));
            started.react('🇧');
            started.react('🇦');
            started.react('🇩');
            started.react('👎');
            games_data[started.guild.id].bankatk = "";
            saveData("games", games_data);
            return;
        }else{
            started.reactions.removeAll();
            updateCoins(guild_id, player_id, amount_batk, users_data)
            started.channel.send("Congratz, you win "+amount_batk+" "+coin+" !").then(win => {win.delete({timeout:2000})});
            started.edit(editCanva(started, line, choice));
            click.push(choice)
            switch(line){
                case "a":
                    clicked_a = click.sort()
                    break;
                case "b":
                    clicked_b = click.sort()
                    break;
                case "c":
                    clicked_c = click.sort()
                    break;
                case "d":
                    clicked_d = click.sort()
                    break;
                case "e":
                    clicked_e = click.sort()
                    break;
            }
            if(!checkWin(line_a,line_b,line_c,line_d,line_e,clicked_a,clicked_b,clicked_c,clicked_d,clicked_e)){
                gameLoop(started, guild_id,player_id,line_a,line_b,line_c,line_d,line_e,clicked_a,clicked_b,clicked_c,clicked_d,clicked_e, games_data, users_data, amount_batk, amount_bigwin, coin);
            }
            else{
                started.reactions.removeAll();
                started.edit(finalConstructor(line_a,line_b,line_c,line_d,line_e,"win", amount_bigwin, coin));
                started.react('🇼');
                started.react('🇮');
                started.react('🇳');
                started.react('🏆');
                updateCoins(guild_id, player_id, amount_bigwin, users_data)
                games_data[started.guild.id].bankatk = "";
                saveData("games", games_data);
                return;
            }
        }
        }) .catch(error => {
            throw error;
        });
        
        
    }).catch(error => {
        throw error;
    });
}

function editCanva(started, line, row){
    var string = started.content.split(/\r?\n/);
    var edit = "";
    switch (line){
        case "a":
            edit = string[0];
            break;
        case "b":
            edit = string[1];
            break;
        case "c":
            edit = string[2];
            break;
        case "d":
            edit = string[3];
            break;
        case "e":
            edit = string[4];
            break;
        default:
            break;
    }
    switch(row){
        case 1:
            edit = edit.replace("one", "moneybag");
            break;
        case 2:
            edit = edit.replace("two", "moneybag");
            break;
        case 3:
            edit = edit.replace("three", "moneybag");
            break;
        case 4:
            edit = edit.replace("four", "moneybag");
            break;
        case 5:
            edit = edit.replace("five", "moneybag");
            break;
        default:
            break;
    }
    switch (line){
        case "a":
            string = edit+"\n"+string[1]+"\n"+string[2]+"\n"+string[3]+"\n"+string[4];
            break;
        case "b":
            string = string[0]+"\n"+edit+"\n"+string[2]+"\n"+string[3]+"\n"+string[4];
            break;
        case "c":
            string = string[0]+"\n"+string[1]+"\n"+edit+"\n"+string[3]+"\n"+string[4];
            break;
        case "d":
            string = string[0]+"\n"+string[1]+"\n"+string[2]+"\n"+edit+"\n"+string[4];
            break;
        case "e":
            string = string[0]+"\n"+string[1]+"\n"+string[2]+"\n"+string[3]+"\n"+edit;
            break;
        default:
            break;
    }
    return string;
}

function checkWin(line_a,line_b,line_c,line_d,line_e,clicked_a,clicked_b,clicked_c,clicked_d,clicked_e){
    var a = [];
    var b = [];
    var c = [];
    var d = [];
    var e = [];
    line_a.forEach(element => a.push(element));
    line_b.forEach(element => b.push(element));
    line_c.forEach(element => c.push(element));
    line_d.forEach(element => d.push(element));
    line_e.forEach(element => e.push(element));
    clicked_a.forEach(element => a.push(element));
    clicked_b.forEach(element => b.push(element));
    clicked_c.forEach(element => c.push(element));
    clicked_d.forEach(element => d.push(element));
    clicked_e.forEach(element => e.push(element));
    a.sort();
    b.sort();
    c.sort();
    d.sort();
    e.sort();
    if(a.length == 5 && b.length == 5 && c.length == 5 && d.length == 5 && e.length == 5){
        return true;
    }else{
        return false;
    }
}

function saveData(type, json){
    switch(type){
        case 'games':
            fs.writeFileSync("./data/games.json", JSON.stringify(json, null, 4), (err) => {
                if (err) console.error(err)
            });
            break;
        case 'users':
            fs.writeFileSync("./data/users.json", JSON.stringify(json, null, 4), (err) => {
                if (err) console.error(err)
            });
            break;
        default:
            break;
    }
}

function updateCoins(guild_id,player_id, amount, users_data){
    users_data[guild_id][player_id].money += amount;
    saveData("users", users_data);
}