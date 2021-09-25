import { boosterRoleId, modoRoleId } from './variables.js';
import fs from 'fs';


export function isBooster(member) {
    return member.roles.cache.has(boosterRoleId);
}


export function isModo(member) {
    return member.roles.cache.has(modoRoleId);
}


export function loadCache(path="cache.json") {
    return JSON.parse(
        fs.readFileSync("cache.json")
    );
}


export function saveCache(data) {
    let textData = JSON.stringify(data);
    fs.writeFile("cache.json", textData, (error) => {
        if (error) {
            console.log("ERROR WHILE DUMPING CACHE!");
        }
        else {
            console.log("Cache updated.")
        };
    });
}


export function updateWelcomeMessage(action, member) {
    // New Student needs to be welcomed
    if (action === "append") {
        client.channels.cache.get("870287403946999849").messages.fetch("890916475379023873")
            .then( (message) => {
                if (message.content === 'Nothing yet.') {
                    var edit = `${member}`;
                }
                else {
                    var edit = message.content + ` ${member}`;
                }

                message.edit(edit)
                    .catch(console.log);
            })
    }

    // Not welcomed Student left the server
    else if (action === "remove") {
        client.channels.cache.get("870287403946999849").messages.fetch("890916475379023873")
            .then( (message) => {
                message.edit(message.content.replaceAll(`${member}`, '').replaceAll('  ', ' '));
            })
            .catch(console.log);
    }

    // All Students are welcomed, reset the queue
    else if (action === "reset") {
        client.channels.cache.get("870287403946999849").messages.fetch("890916475379023873")
            .then( (message) => {
                message.edit('Nothing yet.');
            })
    }
}


export function hasStudentRole(member) {
    return member.roles.cache.has("872267559423053825");
}

