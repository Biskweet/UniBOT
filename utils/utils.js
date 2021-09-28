import * as utils from '../utils/utils.js';
import { boosterRoleId, modoRoleId } from './variables.js';
import fs from 'fs';


export function errorHandler(error, message=null) {
    console.log("-------------------------\nNew error:", message.content, '\n=>', error.message, "\n-------------------------");
    
    if (message !== null)
        message.react('❌');
}



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
                    .catch(errorHandler, {content: "<error while updating welcome message>"});
            })
    }

    // Not welcomed Student left the server
    else if (action === "remove") {
        client.channels.cache.get("870287403946999849").messages.fetch("890916475379023873")
            .then( (message) => {
                message.edit(message.content.replaceAll(`${member}`, '').replaceAll('  ', ' '));
            })

            .catch(errorHandler);
    }

    // All Students are welcomed, reset the queue
    else if (action === "reset") {
        client.channels.cache.get("870287403946999849").messages.fetch("890916475379023873")
            .then( (message) => {
                message.edit('Nothing yet.');
            })

            .catch(errorHandler);
    }
}


export function hasStudentRole(member) {
    return member.roles.cache.has("872267559423053825");
}

