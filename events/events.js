// import { updateWelcomeMsg } from "../utils/utils.js";
// import {  } from "../utils/variables.js";


export function onReady(client) {
    console.log(client.user.tag, "is ready.");
}


export function guildMemberAdd(client, member) {
    client.channels.cache.get("498225252195762192").send(`${member} a rejoint le putain de serveur sa grand-mère`);
}


export function guildMemberRemove(client, member) {
    client.channels.cache.get("498225252195762192").send(`${member} est parti niquer sa mère ailleurs`);
    // if inWelcomeQueue.includes(member.id) {
    //     updateWelcomeMsg(client, "remove", member);
    // }
}

