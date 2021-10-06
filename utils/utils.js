import fs from 'fs';
import axios from 'axios';
import * as variables from '../variables.js';
import { boosterRoleId, modoRoleId } from './variables.js';


const headers = {"Authorization": "Bearer " + TWITTER_TOKEN}


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


export function isCommand(msg) {
    return (message.content.toUpperCase().startsWith(variables.prefix1) ||
            message.content.toUpperCase().startsWith(variables.prefix2));
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
    let response, newTweets, newTweetId;
    response = await axios.get(`https://api.twitter.com/2/users/${cache.twitter[account].twitterAccount}/tweets`, {headers: headers});
    newTweets = response.data;
    newTweetId = newTweets.data[0].id;

    if (newTweetId != cache.twitter[account].lastTweetId) {
        let tweetData, media, date;

        response = await axios.get("https://api.twitter.com/2/tweets?ids=" + newTweetId + "&expansions=attachments.media_keys" +
                              "&media.fields=preview_image_url,type,url&tweet.fields=referenced_tweets,created_at", {headers: headers});
        tweetData = response.data;

        if (tweetData.data[0].includes("referenced_tweets") && (tweetData.data[0].referenced_tweets[0].type.includes("replied_to") ||
                                                                tweetData.data[0].referenced_tweets[0].type.includes("retweeted"))) {
            return; // Do not share if the tweet is a reply/RT
        }

        if tweetData.includes("includes") {
            if (tweetData.includes.media[0].type == "photo") {
                media = tweetData.includes.media[0].url    
            }
            else if (tweetData.includes.media[0].type == "video") {
                tweetData.includes.media[0].preview_image_url;
            }
        }

        date = new Date(tweetData.data[0].created_at;


    }
}


