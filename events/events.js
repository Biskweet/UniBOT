import * as utils from "../utils/utils.js";


export async function onReady() {
    console.log(client.user.tag, "is ready.");
    await utils.updateClientActivity();
    utils.checkSocialMedias();
    setInterval(utils.checkSocialMedias, 30000);
}


export async function guildMemberAdd(member) {
    client.channels.cache.get("498225252195762192").send(`${member} a rejoint le serveur.`);
    await utils.updateClientActivity();

    let ping = client.channels.cache.get("498225252195762192").send(`${member} choisissez pour accéder au serveur !`);

    setTimeout(() => {
        ping.delete()
    }, 300);

}


export async function guildMemberRemove(member) {
    client.channels.cache.get("498225252195762192").send(`${member} a quitté le serveur.`);
    await utils.updateClientActivity();
    if (welcomeQueue.includes(member.id)) {
        await updateWelcomeMsg("remove", member);
        
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

    client.channels.cache.get("498225252195762192").send({embeds: [embed]})
}


export async function guildBanRemove(guildBan) {
    let embed = new MessageEmbed()
        .setAuthor(guildBan.user.tag, guildBan.user.displayAvatarURL())
        .setDescription(`${guildBan.user} a été dé-banni du serveur.`)
        .setColor(65280)
        .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get("498225252195762192").send({embeds: [embed]});
}


export async function checkMemberUpdate(oldMember, newMember) {
    if (utils.hasStudentRole(newMember) && !utils.hasStudentRole(oldMember)) {
        await utils.updateWelcomeMessage("append", newMember);
        welcomeQueue.push(newMember.id)
    }

    if (!utils.hasStudentRole(newMember) && utils.hasStudentRole(oldMember)) {
        await utils.updateWelcomeMessage("remove", newMember);
        let index = welcomeQueue.indexOf(member.id);
        if (index > -1) {
            welcomeQueue.splice(index, 1);
        }
    }
}

