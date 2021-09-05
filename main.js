import DiscordJS from 'discord.js';
import { Intents, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();


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
        let embed = new MessageEmbed();
        message.channel.send({ embeds: [{
            color: 3447003,
            description: "description",
            title: "woosh ",
            author: {name:"author", iconURL:"https://abs.twimg.com/icons/apple-touch-icon-192x192.png"}
        }]});
    }
});

client.login(process.env.DISCORD_TOKEN);

