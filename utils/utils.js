import fs from 'fs';
import axios from 'axios';
import * as utils from '../utils/utils.js';
import { boosterRoleId, modoRoleId } from './variables.js';


export function errorHandler(error, message=null) {
    console.log("-------------------------\nNew error:", message.content, '\n=>', error.message, "\n-------------------------");
    
    if (message !== null)
        message.react('❌');
}


export function capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
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
    client.channels.cache.get("893995887758540810").messages.fetch("894011083029889034")
        .then( (message) => {
            if (action === "append") {
                if (message.content === 'Nothing yet.') {
                    var edit = `${member}`;
                }
                else {
                    var edit = message.content + ` ${member}`;
                }

                message.edit(edit)
                    .catch(errorHandler, {content: "<error while updating welcome message>"});
            }
    

            // Not welcomed Student left the server
            else if (action === "remove") {
                message.edit(message.content.replaceAll(`${member}`, '').replaceAll('  ', ' '));
            }

            // All Students are welcomed, reset the queue
            else if (action === "reset") {
                message.edit('Nothing yet.');
            }
        })

        .catch(errorHandler, {content: "<error while updating welcome message>"});
}


export function hasStudentRole(member) {
    return member.roles.cache.has("779741939447627798");
}


export async function checkSocialMedias() {

}


async function retrieve_tweets(account, channel) {
    axios.get(`https://api.twitter.com/2/users/${"/tweets"}`)
}


