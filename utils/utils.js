import { MessageEmbed } from 'discord.js';
import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv'; 
import * as variables from './variables.js';


dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const WOLFRAMALPHA_TOKEN = process.env.WOLFRAMALPHA_TOKEN;
export const TWITTER_TOKEN = process.env.TWITTER_TOKEN;
export const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN;

const headers = {"Authorization": "Bearer " + TWITTER_TOKEN}


export function saveLogs(content) {
    fs.appendFile("logs.txt", content, (error) => {
        if (error) {
            console.log(`Error while saving logs (${error})`);
        }
    });
}


export async function errorHandler(error, message) {
    let errorMessage = "\n------------ " + (new Date()).toJSON() + " -------------" +
                       "\nNew error: ";
    
    if (message !== null) {
        errorMessage += message.content;
        message.react('❌');
    }
    
    errorMessage += "\n=> " + error.message + 
                    "\n---------------------------------------------------\n";

    console.error(errorMessage);
    saveLogs(errorMessage);
}


export async function updateClientActivity() {
    let serverMembersCount = client.guilds.cache.get(variables.DSUGuildId).memberCount;
    client.user.setActivity(`${serverMembersCount} membres 👀 !`, { type: "WATCHING" });
}


export function capitalize(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}


export function isVIP(member) {
    return member.roles.cache.has(variables.roles.booster) ||
           member.roles.cache.has(variables.roles.modo)    ||
           member.roles.cache.has(variables.roles.vip);
}


export function hasNonSensitiveRole(member) {
    return member.roles.cache.has(variables.roles.student) ||
           member.roles.cache.has(variables.roles.visitor) ||
           member.roles.cache.has(variables.roles.certif)  ||
           member.roles.cache.has(variables.roles.alumni);
}


export function isModo(member) {
    try {
        return (member.roles.cache.has(variables.roles.moderator) || (member.id == "329718763698257931"));
    }

    catch (error) {
        return false;
    }
}


export function hasSensitiveRole(member) {
    return (member.roles.cache.has(variables.roles.teacherResearcher) ||
            member.roles.cache.has(variables.roles.universityAdmin));
}


export function isCommand(msg) {
    return msg.toUpperCase().startsWith(variables.prefix1);
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
            console.log(`Error while dumping cache (${error})`);

        } else {
            console.log("Cache updated.");
        }
    });
}


export async function checkSocialMedias() {
    let twitterAccount;
    for (twitterAccount of variables.twitterAccounts) {
        retrieveTweets(twitterAccount).catch( (error) => console.log("Error while fetching tweets for account:" + twitterAccount + " (" + err.message + ")"));
    }

    retrieveVideos().catch( (err) => {});
    checkLeaderboard().catch( (error) => console.log("Error while checking leaderboard (" + error.message + ")."));
}


export async function checkLeaderboard() {
    let i = 0;
    let topMember, newTopMemberId, vipRole, oldTopMember;

    axios.get("https://mee6.xyz/api/plugins/levels/leaderboard/" + variables.DSUGuildId)
        .then( (response) => {
            response = response.data;
            client.guilds.cache.forEach( (server) => {
                newTopMemberId = response.players[i].id;

                server.members.fetch()
                    .then( () => {
                        do { // Searching for the first available member in the list
                            newTopMemberId = response.players[i].id;
                            i++;
                        } while (!server.members.cache.has(newTopMemberId));

                        topMember = server.members.cache.get(newTopMemberId);
                        if (newTopMemberId != cache.topMemberId) {
                            vipRole = server.roles.cache.get(variables.roles.vip);
                            oldTopMember = server.members.cache.get(cache.topMemberId);
                            
                            if (oldTopMember != undefined) {
                                oldTopMember.roles.remove(variables.roles.vip);
                            }
                            
                            server.members.cache.get(newTopMemberId).roles.add(vipRole);
                            cache.topMemberId = newTopMemberId;
                            saveCache(cache);

                            console.log("New top member (id=" + newTopMemberId + ")");
                        }
                    }).catch( (error) => errorHandler(error, null));
            });
        });
}


async function retrieveVideos() {
    let newVideoId;

    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_TOKEN}` +
              `&channelId=${cache.youtube.account}&part=snippet,id&order=date&maxResults=1`)

        .then( (response) => {
            response = response.data;
            if (!response.hasOwnProperty("items")) {
                return;
            }

            newVideoId = response.items[0].id.videoId;

            if (newVideoId != cache.youtube.lastVideoId) {
                let channel = client.channels.cache.get(variables.channels.youtube);
                channel.send("Nouvelle vidéo de Sorbonne Université !\n" +
                             "https://www.youtube.com/watch?v=" + newVideoId);

                cache.youtube.lastVideoId = newVideoId;
                saveCache(cache);
            }
        })

        .catch( (error) => {});
}


async function retrieveTweets(account) {
    let newTweets, newTweetId;
    axios.get(`https://api.twitter.com/2/users/${cache.twitter[account].twitterAccount}/tweets`, {headers: headers})
        .then( (response) => {
            newTweets = response.data;
            newTweetId = newTweets.data[0].id;

            if (newTweetId != cache.twitter[account].lastTweetId) {

                let tweetData, media, date, user, text, channel;

                axios.get("https://api.twitter.com/2/tweets?ids=" + newTweetId + "&expansions=attachments.media_keys" +
                                           "&media.fields=preview_image_url,type,url&tweet.fields=referenced_tweets,created_at", {headers: headers})
                    .then( (response) => {

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
                            .then( (response) => {
                                user = response.data.data[0];

                                text = newTweets.data[0].text.replaceAll('_', '\_') + `\n\n[__Ouvrir__](https://twitter.com/${user.username}/status/${newTweetId})`;

                                channel = client.channels.cache.get(variables.channels.twitter);
                                
                                let embed = new MessageEmbed()
                                    .setDescription(text)
                                    .setColor(1942002)
                                    .setAuthor({ name: `${user.name} (@${user.username}) a tweeté :`, iconURL: cache.twitter[account].iconUrl})
                                    .setImage(media)
                                    .setFooter({ text: `Le ${date.toLocaleDateString("fr-FR", { day:"numeric", month:"long", year: "numeric", hour:"numeric", minute:"numeric" })}`,
                                                 iconURL: "https://abs.twimg.com/icons/apple-touch-icon-192x192.png"});

                                channel.send({ embeds: [embed] });

                                cache.twitter[account].lastTweetId = newTweetId;
                                saveCache(cache);
                            }).catch( (error) => {});
                    })
        }
    }).catch( (error) => {});
}


export function generateFileName(url) {
    if (url[url.at(-1)] === "/") {
        url = url.slice(0, url.length - 1);
    }

    let oldFileName = url.split("/").at(-1);
    let extension = oldFileName.split(".").at(-1);
    let newFileName = parseInt(Math.random() * 10e10).toString();

    return process.cwd() + "/temp/" + newFileName + "." + extension;
}
