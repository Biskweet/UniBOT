import * as utils from "../utils/utils.js";


export function onReady() {
    console.log(client.user.tag, "is ready.");
    utils.updateClientActivity();
    setInterval(utils.checkSocialMedias, 300000);
}


export async function guildMemberAdd(member) {
    client.channels.cache.get("752891071553601638").send(`${member} a rejoint le serveur.`);
    utils.updateClientActivity();
}


export async function guildMemberRemove(member) {
    client.channels.cache.get("777521246950129674").send(`${member} a quitté le serveur.`);
    utils.updateClientActivity();
    if (welcomeQueue.includes(member.id)) {
        updateWelcomeMsg("remove", member);
        
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

    client.channels.cache.get("776802470089064510").send({embeds: [embed]})
}


export async function guildBanRemove(guildBan) {
    let embed = new MessageEmbed()
        .setAuthor(guildBan.user.tag, guildBan.user.displayAvatarURL())
        .setDescription(`${guildBan.user} a été dé-banni du serveur.`)
        .setColor(65280)
        .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get("776802470089064510").send({embeds: [embed]});
}


export async function checkMemberUpdate(oldMember, newMember) {
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

