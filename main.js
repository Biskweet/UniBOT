import Discord from 'discord.js';
import { Intents, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
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

    // --- Moderation ---
    if (command == "ping") {
        moderation.ping(message);
    }

    if (command == "sendinfo") {
        moderation.sendInfo(message);
    }

    if (command == "kick") {

    }
    // ------------------


    // --- Miscellaneous ---
    if (command == "8ball") {
        misc.eightBall(message, words.slice(2));
    }

    if (command == "wiki") {
        misc.wiki(message, words.slice(2));
    }
    
});

client.login(process.env.DISCORD_TOKEN);
