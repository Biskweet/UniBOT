import { MessageEmbed } from 'discord.js';
import fs from 'fs';
import axios from 'axios';
import * as variables from './variables.js';
import { boosterRoleId, modoRoleId } from './variables.js';
import dotenv from 'dotenv'; 


dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const WOLFRAMALPHA_TOKEN = process.env.WOLFRAMALPHA_TOKEN;
export const TWITTER_TOKEN = process.env.TWITTER_TOKEN;
export const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;

const headers = {"Authorization": "Bearer " + TWITTER_TOKEN}



export async function errorHandler(error, message) {
    console.log("-------------------------\nNew error:", message.content, '\n=>', error.message, "\n-------------------------");
    
    if (message !== null) {
        message.react('❌');
    }
}


export async function updateClientActivity() {
    let serverMembersCount = client.guilds.cache.get("498225252195762186").memberCount;
    client.user.setActivity(`${serverMembersCount} membres 👀 !`, {type: "WATCHING"});
}


export function capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}


export function isBooster(member) {
    return member.roles.cache.has(boosterRoleId);
}


export function hasStudentRole(member) {
    return member.roles.cache.has("779741939447627798");
}


export function isModo(member) {
    return (member.roles.cache.has(modoRoleId) || (member.id == "329718763698257931"));
}


export function hasSensitiveRole(member) {
    return (member.roles.cache.has("777533078763208724") || member.roles.cache.has("754463571345276969"));
}


export function isCommand(msg) {
    return (msg.toUpperCase().startsWith(variables.prefix1) ||
            msg.toUpperCase().startsWith(variables.prefix2));
}


export function loadCache(path="cache.json") {
    try {
        let fileContent = JSON.parse(
            fs.readFileSync(path)
        );
        console.log("Successfully loaded the cache file.");
        return fileContent;
    }

    catch (err) {
        throw new Error("Error while loading the cache file (incorrect file path?)");
    }
}


export function saveCache(data) {
    let textData = JSON.stringify(data);
    fs.writeFile("cache.json", textData, (error) => {
        if (error) {
            console.log("ERROR WHILE DUMPING CACHE!");

        } else {
            console.log("Cache updated.");
        };
    });
}


export async function updateWelcomeMessage(action, member) {
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
                    .catch( (error) => {utils.errorHandler(error, {content: "<error while updating welcome message>"});} );
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

        .catch( (error) => {utils.errorHandler(error, {content: "<error while updating welcome message>"});} );
}


export async function checkSocialMedias() {
    let twitterAccount;
    for (twitterAccount of variables.twitterAccounts) {
        retrieveTweets(twitterAccount)
            .catch((err) => {console.log, "Error while fetching tweets for account:" + twitterAccount});
    }

    retrieveVideos().catch( (err) => {console.log("Error while fetching videos.");} );
}


async function retrieveVideos() {
    let response, newVideoId;

    response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_TOKEN}` +
                               `&channelId=${cache.youtube.account}&part=snippet,id&order=date&maxResults=1`)

    response = response.data;
    if (!response.hasOwnProperty("items")) {
        return;
    }

    newVideoId = response.items[0].id.videoId;

    if (newVideoId != cache.youtube.lastVideoId) {
        let channel = client.channels.cache.get(vars.youtubeChannelId);
        channel.send("Nouvelle vidéo de Sorbonne Université !\n" +
                     "https://www.youtube.com/watch?v=" + newVideoId);

        cache.youtube.lastVideoId = newVideoId;
        saveCache(cache);
    }
}


async function retrieveTweets(account) {
    let newTweets, newTweetId;
    axios.get(`https://api.twitter.com/2/users/${cache.twitter[account].twitterAccount}/tweets`, {headers: headers})
        .then((response) => {
            newTweets = response.data;
            newTweetId = newTweets.data[0].id;

            if (newTweetId != cache.twitter[account].lastTweetId) {

                let tweetData, media, date, user, text, channel;

                axios.get("https://api.twitter.com/2/tweets?ids=" + newTweetId + "&expansions=attachments.media_keys" +
                                           "&media.fields=preview_image_url,type,url&tweet.fields=referenced_tweets,created_at", {headers: headers})
                    .then((response) => {

                        tweetData = response.data;

                        if (tweetData.data[0].hasOwnProperty("referenced_tweets") && (tweetData.data[0].referenced_tweets[0].type.includes("replied_to") ||
                                                                                      tweetData.data[0].referenced_tweets[0].type.includes("retweeted"))) {
                            return; // Do not share if the tweet is a reply/RT
                        }

                        if (tweetData.hasOwnProperty("includes")) {
                            if (tweetData.includes.media[0].type == "photo") {
                                media = tweetData.includes.media[0].url    
                            }
                            else if (tweetData.includes.media[0].type == "video") {
                                tweetData.includes.media[0].preview_image_url;
                            }
                        }

                        date = new Date(tweetData.data[0].created_at);

                        axios.get("https://api.twitter.com/2/users?ids=" + cache.twitter[account].twitterAccount, {headers: headers})
                            .then((response) => {
                                user = response.data.data[0];

                                text = newTweets.data[0].text.replaceAll('_', '\_') + `\n\n[__Ouvrir__](https://twitter.com/${user.username}/status/${newTweetId})`;

                                channel = client.channels.cache.get(vars.twitterChannelId);
                                
                                let embed = new MessageEmbed()
                                    .setDescription(text)
                                    .setColor(1942002)
                                    .setAuthor(`${user.name} (@${user.username}) a tweeté :`, cache.twitter[account].iconUrl)
                                    .setImage(media)
                                    .setFooter(`Le ${date.toLocaleDateString("fr-FR", {day:"numeric", month:"long", year: "numeric", hour:"numeric", minute:"numeric"})}`,
                                               "https://abs.twimg.com/icons/apple-touch-icon-192x192.png");

                                channel.send({embeds: [embed]});

                                cache.twitter[account].lastTweetId = newTweetId;
                                saveCache(cache);
                            })
                    })
        }
    })
}





