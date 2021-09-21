import { boosterRoleId, modoRoleId } from './variables.js';


export function isBooster(member) {
    return !!member.roles.cache.get(boosterRoleId);
}


export function isModo(member) {
    return !!member.roles.cache.get(modoRoleId);
}


export function updateWelcomeMessage(action, member) {
    if (action === "append") {
        client.channels.cache.get("498225252195762192").message.fetch("889583657596108810")
            .then( (message) => {
                if (message.content === 'Nothing yet') {
                    message.edit(`${member}`)
                        .catch(console.log);
                }
                else {
                    message.edit(message.content + ` ${member}`)
                        .catch(console.log);
                }
            })
    }

    else if (action === "remove") {
        client.channels.cache.get("498225252195762192").message.fetch("889583657596108810")
            .then( (message) => {
                message.edit(message.content.replaceAll(`${member}`, ''));
            })
            .catch(console.log);
    }

    else if (action === "reset") {
        client.channels.cache.get("498225252195762192").message.fetch("889583657596108810")
            .then( (message) => {
                message.edit('Nothing yet.');
            })
    }
}
