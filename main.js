import { Intents, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import * as moderation from './commands/moderation.js';
import * as variables from './utils/variables.js';
import * as events from './events/events.js';
import * as utils from './utils/utils.js'
import * as misc from './commands/misc.js';
import * as vip from './commands/vip.js'
import { help } from './commands/help.js';

console.log("Launching...");

dotenv.config();


global.cache = utils.loadCache();
global.welcomeQueue = [];


global.client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_BANS
    ],

    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ]
});



// ---------- Events ----------
client.on("ready", async () => {
    events.onReady();
});


client.on("guildMemberAdd", async (member) => {
    await events.guildMemberAdd(member);
})


client.on("guildMemberRemove", async (member) => {
    await events.guildMemberRemove(member);
})


client.on("guildMemberUpdate", async (oldMember, newMember) => {
    await events.checkMemberUpdate(oldMember, newMember);
})


client.on("messageReactionAdd", async (messageReaction, user) => {
    await events.messageReactionAdd(messageReaction, user);
})


client.on("guildBanAdd", async (guildBan) => {
    events.guildBanAdd(guildBan);
})


client.on("guildBanRemove", async (guildBan) => {
    events.guildBanRemove(guildBan);
})


client.on("messageDelete", async (message) => {
    await events.messageDelete(message);
})
// ----------------------------


// -------- On message --------
client.on("messageCreate", async (message) => {
    try {
        if (utils.isCommand(message.content) === false) {
            return moderation.filterMessage(message);  // Msg isn't a command, just filter it
        }

        if (message.author.bot === true) {
            return;  // Do not react to self or other bots
        }

        // Split the message for words and remove the empty ones (ex: 'a  b'.split(' ') -> ['a', '', ''])
        const words = message.content.split(' ').filter( (word) => word != '' );
        const command = words[1];


        // ------- Help --------
        if (command === "help") {
            await help(message, words.slice(2).join());
        }
        // ---------------------


        // ---- Moderation -----
        if (command === "destroy") {
            moderation.destroyClient(message);
        }

        if (command === "clear") {
            await moderation.clear(message, words.slice(2))
        }

        if (command === "mute") {
            await moderation.mute(message, words.slice(3));
        }

        if (command === "unmute") {
            await moderation.unmute(message);
        }

        if (command === "kick") {
            await moderation.kick(message, words.slice(3).join(' '))
        }

        if (command === "ban") {
            await moderation.ban(message, words.slice(3).join(' '))
        }

        if (command === "unban") {
            await moderation.unban(message, words.slice(2).join(' '))
        }

        if (command === "printCache") {
            await moderation.printCache(message);
        }
        // ---------------------


        // ------- VIP --------
        if (command === "couleur" || command === "color") {
            await vip.couleur(message, words.slice(2));
        }
        // --------------------


        // --- Miscellaneous ---
        if (command === "ping") {
            await misc.ping(message);
        }

        if (command === "8ball") {
            await misc.eightBall(message, words.slice(2));
        }

        if (command === "wiki") {
            await misc.wiki(message, words.slice(2));
        }

        if (command === "sendinfo" || command === "send_info") {
            await misc.sendInfo(message);
        }

        if (command === "answer") {
            await misc.answer(message,words.slice(2));
        }
        // ---------------------

        await moderation.filterMessage(message);
    }

    catch (error) {
        await utils.errorHandler(error, message);
    }
});
// ---------------------------


client.login(process.env.DISCORD_TOKEN);
