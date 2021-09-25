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


export function checkMemberUpdate(oldMember, newMember) {
    if (utils.hasStudentRole(newMember) && !utils.hasStudentRole(oldMember)) {
        utils.updateWelcomeMessage("append", newMember);
        welcomeQueue.push(newMember.id)
    }
}

