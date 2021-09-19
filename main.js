import Discord from 'discord.js';
import dotenv from 'dotenv';
import { Intents, MessageEmbed } from 'discord.js';
import { help } from './commands/help.js';
import * as variables from './utils/variables.js';
import * as moderation from './commands/moderation.js';
import * as misc from './commands/misc.js';
dotenv.config();

const PREFIX = variables.prefix;

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
}); 


client.on("ready", () => {
    console.log('Bot is ready.');
});



client.on("messageCreate", (message) => {
    if (!message.content.startsWith(PREFIX))
        return;  // Not a command

    const words = message.content.split(' ');
    const command = words[1];

    // ---- Moderation -----
    if (command == "destroy") {
        moderation.destroyClient(message, client);
    }

    if (command == "temp2") {
        let msg = client.channels.cache.get("498225252195762192").messages.fetch("884935471598288937")
            .then(msg => msg.edit(msg.content + " <@329718763698257931>"));
    }
    // ---------------------


    // ------- Help --------
    if (command === "help") {
        help(message, words.slice(2).join());
    }
    // ---------------------


    // --- Miscellaneous ---
    if (command == "sendinfo") {
        misc.sendInfo(message);
    }

    if (command == "ping") {
        misc.ping(message);
    }

    if (command == "8ball") {
        misc.eightBall(message, words.slice(2));
    }

    if (command == "wiki") {
        misc.wiki(message, words.slice(2));
    }

    if (command == "couleur") {
        misc.couleur(message, words.slice(2))
    }
    // ---------------------
});


client.login(process.env.DISCORD_TOKEN);
