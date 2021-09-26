import * as utils from "../utils/utils.js";


export function onReady() {
    console.log(client.user.tag, "is ready.");
}


export function guildMemberAdd(member) {
    client.channels.cache.get("498225252195762192").send(`${member} a rejoint le serveur.`);
}


export function guildMemberRemove(member) {
    client.channels.cache.get("498225252195762192").send(`${member} a quitté le serveur.`);
    if (welcomeQueue.includes(member.id)) {
        updateWelcomeMsg("remove", member);
        
        // Removing member from the welcome queue
        let index = welcomeQueue.indexOf(member.id);
        if (index > -1) {
            welcomeQueue.splice(index, 1);
        }
    }
}


export function guildBanAdd(guildBan) {
    client.channels.cache.get("498225252195762192").send({ embeds: [{
        author: {name: guildBan.user.tag, iconURL: guildBan.user.displayAvatarURL()},
        description: `${guildBan.user} a été banni du serveur.`,
        color: 16711680,
        thumbnail: {url: guildBan.user.displayAvatarURL()}
    }]})
}


export function guildBanRemove(guildBan) {
    client.channels.cache.get("498225252195762192").send({ embeds: [{
        author: {name: guildBan.user.tag, iconURL: guildBan.user.displayAvatarURL()},
        description: `${guildBan.user} a été dé-banni du serveur.`,
        color: 65280,
        thumbnail: {url: guildBan.user.displayAvatarURL()}
    }]})
}


export function checkMemberUpdate(oldMember, newMember) {
    if (utils.hasStudentRole(newMember) && !utils.hasStudentRole(oldMember)) {
        utils.updateWelcomeMessage("append", newMember);
        welcomeQueue.push(newMember.id)
    }

    if (!utils.hasStudentRole(newMember) && utils.hasStudentRole(oldMember)) {
        utils.updateWelcomeMessage("remove", newMember);
        let index = welcomeQueue.indexOf(member.id);
        if (index > -1) {
            welcomeQueue.splice(index, 1);
        }
    }
}

