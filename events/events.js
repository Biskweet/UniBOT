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
    client.guilds.cache.get("749364640147832863").channels.cache.get("776599592980185119").send(`${member} a rejoint le serveur !`);
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
        .setAuthor({ name: guildBan.user.tag, iconURL: guildBan.user.displayAvatarURL() })
        .setDescription(`${guildBan.user} a été banni du serveur.`)
        .setColor(variables.colors.Red)
        .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get(variables.logsChannelId).send({ embeds: [embed] });
}


export async function guildBanRemove(guildBan) {
    let embed = new MessageEmbed()
        .setAuthor({ name: guildBan.user.tag, iconURL: guildBan.user.displayAvatarURL() })
        .setDescription(`${guildBan.user} a été dé-banni du serveur.`)
        .setColor(variables.colors.Green)
        .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get(variables.logsChannelId).send({ embeds: [embed] });
}


export async function checkMemberUpdate(oldMember, newMember) {
    if (!utils.hasSensitiveRole(oldMember) && utils.hasSensitiveRole(newMember)) {
        client.channels.cache.get(variables.modosChannelId).send(`${newMember} a pris un rôle sensible. Merci de vérifier sa légitimité.`);
    }
}


export async function messageDelete(message) {
    if (message.author == null || message.author.bot || utils.isModo(message.member)) {
        return;  // Do not log moderators's or bots's messages
    }

    let logsChannel, embed;
    logsChannel = client.channels.cache.get("776802470089064510");
    embed = new MessageEmbed()
                    .setColor(variables.colors.SuHex)
                    .setDescription(`**🗑️ | Message supprimé dans ${message.channel} :**\n` + message.content + "\n\n")
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    .setFooter({ text: `Author ID : ${message.author.id} • ${(new Date()).toLocaleString("fr-FR")}`});

    logsChannel.send({ embeds: [embed] });

    // Add all attachments of the message
    if (message.attachments.size > 0) {
        for (let attachment of message.attachments) {   
            logsChannel.send(attachment[1].url);
        }

        embed = new MessageEmbed()
            .setColor(variables.colors.SuHex)
            .setAuthor({ name: "(fin des pièces-jointes)" });

        logsChannel.send({ embeds: [embed] });
    }
}
