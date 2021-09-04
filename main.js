import DiscordJS from 'discord.js'
import { Intents, MessageEmbed } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()


const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ]
});

client.on("ready", () => {
    console.log('Bot is ready.');
});

client.on("messageCreate", (message) => {
    if (message.content === "ping") {
        message.reply({
            content: "Pong (JS v 0.1).",
        });
    }
});

client.login(process.env.DISCORD_TOKEN);

