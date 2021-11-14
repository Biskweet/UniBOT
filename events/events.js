import * as utils from "../utils/utils.js";
import * as variables from '../utils/variables.js';
import * as moderation from '../commands/moderation.js';
import { MessageEmbed } from 'discord.js';


export async function onReady() {
    console.log(client.user.tag, "is ready.");
    await utils.updateClientActivity();
    utils.checkSocialMedias();
    setInterval(utils.checkSocialMedias, 300000);
}


export async function guildMemberAdd(member) {
    client.guilds.cache.get("749364640147832863").channels.cache.get(variables.newMembersChannelId).send(`${member} a rejoint le serveur.`);
    await utils.updateClientActivity();

    let memberJoinLog = "\n------------ " + (new Date()).toJSON() + " -------------" +
                        `\n${member.user.tag} joined the server.` +
                        "\n---------------------------------------------------\n";

    utils.saveLogs(memberJoinLog);

    client.channels.cache.get(variables.startHereChannelId).send(`${member} choisissez pour accéder au serveur !`)
        .then( (ping) => {
            setTimeout(() => {
                ping.delete();
            }, 500);
        });
}


export async function guildMemberRemove(member) {
    client.channels.cache.get(variables.leavingMembersChannelId).send(`${member.user.tag} a quitté le serveur.`);
    await utils.updateClientActivity();

    let memberLeaveLog = "\n------------ " + (new Date()).toJSON() + " -------------" +
                         `\n${member.user.tag} left the server.` +
                         "\n---------------------------------------------------\n";

    utils.saveLogs(memberLeaveLog);

    if (welcomeQueue.includes(member.id)) {
        await moderation.updateWelcomeMessage("remove", member);
        
        // Removing member from the welcome queue
        let index = welcomeQueue.indexOf(member.id);
        if (index > -1) {
            welcomeQueue.splice(index, 1);
        }
    }
}


export async function guildBanAdd(guildBan) {
    let embed = new MessageEmbed()
        .setAuthor(guildBan.user.tag, guildBan.user.displayAvatarURL())
        .setDescription(`${guildBan.user} a été banni du serveur.`)
        .setColor(16711680)
        .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get(variables.logsChannelId).send({embeds: [embed]});
}


export async function guildBanRemove(guildBan) {
    let embed = new MessageEmbed()
        .setAuthor(guildBan.user.tag, guildBan.user.displayAvatarURL())
        .setDescription(`${guildBan.user} a été dé-banni du serveur.`)
        .setColor(65280)
        .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get(variables.logsChannelId).send({embeds: [embed]});
}


export async function checkMemberUpdate(oldMember, newMember) {
    if (!utils.hasAccessRole(oldMember) && utils.hasAccessRole(newMember)) {
        await moderation.updateWelcomeMessage("append", newMember);
        welcomeQueue.push(newMember.id)
    }

    if (!utils.hasAccessRole(newMember) && utils.hasAccessRole(oldMember)) {
        await moderation.updateWelcomeMessage("remove", newMember);
        let index = welcomeQueue.indexOf(member.id);
        if (index > -1) {
            welcomeQueue.splice(index, 1);
        }
    }

    if (utils.hasSensitiveRole(oldMember) && !utils.hasSensitiveRole(newMember)) {
        client.channels.cache.get(variables.modosChannelId).send(`${newMember} a pris un rôle sensible. Merci de vérifier sa légitimité.`);
    }
}


export async function messageReactionAdd(messageReaction, user) {
    if (messageReaction.me) {
        return;  // Do not react to self
    }

    if (messageReaction.message.id == "894011083029889034" && messageReaction.emoji.name == "repeat") {
        await moderation.updateWelcomeMessage("reset", user);

        client.channels.cache.get("893995887758540810").messages.fetch("894011083029889034")

            .then( (message) => {
                await message.reactions.removeAll();
                await message.react('🔁');
            })

            .catch( (error) => {console.log("Error while trying to reset the message through reaction.\n" + error);});
    }
}
