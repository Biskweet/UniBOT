const Discord = require("discord.js");
const variables = require("./utils/variables.js");
const utils = require("./utils/utils.js");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");


global.cache = utils.loadCache("./cache.json");

global.client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_BANS
    ],

    partials: [
        "MESSAGE",
        "CHANNEL",
        "REACTION"
    ]
});


console.log("Launching...");

dotenv.config();


// Making sure ./temp directory exists
if (fs.existsSync("./temp") == false) {
    fs.mkdirSync("./temp");
}


// Setting up commands
client.commands = new Discord.Collection();
for (let cmddir of ["./misc/", "./moderation/"]) {
    fs.readdir(cmddir, (error, commandFiles) => {
        if (error) {
            console.error(`Error when loading commands from ${cmddir}.\nExiting.`);
            client.destroy();
            process.exit(1);
        }

        for (let commandFile of commandFiles) {
            let command = {
                execute: require(commandFile),
                name: path.parse(commandFile).name
            };

            client.commands.set(command.name, command);
        }
    });
}


// Setting up events
fs.readdir("./events/", (error, eventFiles) => {
    if (error) {
        console.error("Error when loading events from ./events/.\nExiting.");
        client.destroy();
        process.exit(1);
    }

    for (let eventFile of eventFiles) {
        let event = {
            execute: require(eventFile),
            name: path.parse(eventFile).name
        };

        client.on(event.name, (...args) => event.execute(...args));
    }
})


// Launch
client.login(process.env.DISCORD_TOKEN);

