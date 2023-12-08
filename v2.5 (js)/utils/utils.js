const { MessageEmbed } = require("discord.js");
const variables = require("./variables.js");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");


dotenv.config();

const headers = { Authorization: "Bearer " + process.env.TWITTER_TOKEN };


module.exports.saveLogs = async (content) => {
    fs.appendFile("logs.txt", content, (error) => {
        if (error) {
            console.log(`Error while saving logs (${error})`);
        }
    });
}


module.exports.errorHandler = async (error, message) => {
    let errorMessage = "\n------------ " + (new Date()).toJSON() + " -------------" +
                       "\nNew error: ";

    if (message !== null) {
        errorMessage += message.content;
        message.react('❌');
    }

    errorMessage += "\n=> " + error.message +
                    "\n---------------------------------------------------\n";

    console.error(errorMessage);
    module.exports.saveLogs(errorMessage);
}


module.exports.updateClientActivity = async () => {
    let serverMembersCount = client.guilds.cache.get(variables.DSUGuildId).memberCount;
    client.user.setActivity(`${serverMembersCount} membres 👀 !`, { type: "WATCHING" });
}


module.exports.capitalize = (string) => {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}


module.exports.isVIP = (member) => {
    return member.roles.cache.has(variables.roles.moderator) ||
           member.roles.cache.has(variables.roles.booster)   ||
           member.roles.cache.has(variables.roles.vip);
}


module.exports.hasNonSensitiveRole = (member) => {
    return member.roles.cache.has(variables.roles.student) ||
           member.roles.cache.has(variables.roles.visitor) ||
           member.roles.cache.has(variables.roles.certif)  ||
           member.roles.cache.has(variables.roles.alumni);
}


module.exports.isModo = (member) => {
    return member?.roles.cache.has(variables.roles.moderator) || (member?.id == "329718763698257931");
}


module.exports.hasSensitiveRole = (member) => {
    return (member.roles.cache.has(variables.roles.teacherResearcher) ||
            member.roles.cache.has(variables.roles.universityAdmin));
}


module.exports.isCommand = (message) => {
    return message.content.toUpperCase().startsWith(variables.prefix);
}


module.exports.loadCache = (path="./cache.json") => {
    if (fs.existsSync(path)) {
        let fileContent = JSON.parse(fs.readFileSync(path));

        // Parsing Date objects to enable corresponding methods
        fileContent.deleteQueue = fileContent.deleteQueue.map( (obj) => {
            return { date: new Date(obj.date), messages: obj.messages };
        })

        console.log("Successfully loaded the cache file.");

        return fileContent;
    } else {
        console.error(`====================\nError while loading the cache file (${error})`);
        process.exit();
    }
}


module.exports.saveCache = (data) => {
    let textData = JSON.stringify(data);
    fs.writeFile("cache.json", textData, (error) => {
        if (error) {
            console.error(`Error while dumping cache (${ error })`);
        } else {
            console.log("Cache updated.");
        }
    });
}


module.exports.checkSocialMedias = async () => {
    for (let twitterAccount of variables.twitterAccounts) {
        module.exports.retrieveTweets(twitterAccount).catch( (error) => console.log(`Error while fetching tweets for account: ${twitterAccount} (${error})`));
    }

    module.exports.retrieveVideos().catch( () => {});  // Removed the logger because of spam
    module.exports.checkLeaderboard().catch( (error) => console.error(`Error while checking leaderboard (${error}).`));
}


module.exports.checkLeaderboard = async () => {
    let i = 0;
    let newTopMemberId, vipRole, oldTopMember;

    axios.get("https://mee6.xyz/api/plugins/levels/leaderboard/" + variables.DSUGuildId)
        .then( (response) => {
            response = response.data;
            client.guilds.cache.forEach( (server) => {
                newTopMemberId = response.players[i].id;

                server.members.fetch()
                    .then( () => {

                        // Searching for the first valid member in the leaderboard
                        do {
                            newTopMemberId = response.players[i].id;
                            i++;
                        } while (!server.members.cache.has(newTopMemberId));

                        if (newTopMemberId != cache.topMemberId) {
                            vipRole = server.roles.cache.get(variables.roles.vip);
                            oldTopMember = server.members.cache.get(cache.topMemberId);

                            // There was a previous top member
                            if (oldTopMember != undefined) {

                                // Remove all associated VIP roles
                                oldTopMember.roles.cache.forEach( (role) => {
                                    if (role.name.startsWith("VIP")) {
                                        oldTopMember.roles.remove(role.id)
                                            .catch( () => module.exports.errorHandler({ message: `Error while trying to remove role ${role.id} from ${newMember.user.tag} (${newMember.id})` }, null));
                                    }
                                });
                            }

                            server.members.cache.get(newTopMemberId).roles.add(vipRole);
                            cache.topMemberId = newTopMemberId;
                            module.exports.saveCache(cache);

                            console.log("New top member (id=" + newTopMemberId + ")");
                        }
                    }).catch( (error) => module.exports.errorHandler(error, null));
            });
        })
        .catch( (error) => module.exports.errorHandler(error, null));
}


module.exports.retrieveVideos = async () => {
    let newVideoId;

    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${ process.env.YOUTUBE_TOKEN }` +
              `&channelId=${ cache.youtube.account }&part=snippet,id&order=date&maxResults=1`)

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
                module.exports.saveCache(cache);
            }
        })

        .catch( () => {});
}


module.exports.retrieveTweets = async (account) => {
    let newTweets, newTweetId, tweetData, media;

    axios.get(`https://api.twitter.com/2/users/${cache.twitter[account].twitterAccount}/tweets`, { headers: headers })
        .then( (response) => {

            newTweets = response.data;
            newTweetId = newTweets.data[0].id;

            if (newTweetId == cache.twitter[account].lastTweetId) {
                throw new Error("No new tweet.");  // Interrupting the Promise chain
            }

            return axios.get("https://api.twitter.com/2/tweets?ids=" + newTweetId + "&expansions=attachments.media_keys" +
                             "&media.fields=preview_image_url,type,url&tweet.fields=referenced_tweets,created_at", { headers: headers });

        })

        .then( (response) => {

            tweetData = response.data;

            if (tweetData.data[0].hasOwnProperty("referenced_tweets") &&
               (tweetData.data[0].referenced_tweets[0].type.includes("replied_to") ||
                tweetData.data[0].referenced_tweets[0].type.includes("retweeted"))) {
                return; // Do not repost if the tweet is a reply/RT
            }

            if (tweetData.hasOwnProperty("includes")) {
                if (tweetData.includes.media[0].type == "photo") media = tweetData.includes.media[0].url;
                else if (tweetData.includes.media[0].type == "video") media = tweetData.includes.media[0].preview_image_url;
            }

            return axios.get("https://api.twitter.com/2/users?ids=" + cache.twitter[account].twitterAccount, { headers: headers });

        })

        .then( (response) => {
            let channel, date, text, user;

            date = new Date(tweetData.data[0].created_at);

            user = response.data.data[0];

            text = newTweets.data[0].text.replaceAll('_', '\_') + `\n\n[__Ouvrir__](https://twitter.com/${user.username}/status/${newTweetId})`;

            channel = client.channels.cache.get(variables.channels.twitter);

            let embed = new MessageEmbed()
                .setDescription(text)
                .setColor(1942002)
                .setAuthor({ name: `${user.name} (@${user.username}) a tweeté :`, iconURL: cache.twitter[account].iconUrl })
                .setImage(media)
                .setFooter({ text: "Le " + date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric" }),
                             iconURL: "https://abs.twimg.com/icons/apple-touch-icon-192x192.png" });

            cache.twitter[account].lastTweetId = newTweetId;
            module.exports.saveCache(cache);

            channel.send({ embeds: [embed] });
        })

        .catch( () => {});
}


module.exports.generateFileName = (url) => {
    if (url[url.at(-1)] === '/') {
        url = url.slice(0, url.length - 1);
    }

    let oldFileName = url.split('/').at(-1);
    let extension = oldFileName.split('.').at(-1);
    let newFileName = Math.floor(Math.random() * 10e10).toString();

    return process.cwd() + "/temp/" + newFileName + '.' + extension;
}


module.exports.logDirectMessages = async (message) => {
    let logsChannel = client.channels.cache.get(variables.channels.logs);

    let embed = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setTitle("Nouveau message privé")
        .setDescription(message.content)
        .setFooter({ text: `Author ID : ${message.author.id} • ${new Date().toLocaleString("fr-FR")}` })
        .setColor(variables.colors.SuHex);

    return logsChannel.send({ embeds: [embed] });
}


module.exports.filterMessage = (message) => {
    // If the message has a discord invite link
    if (message.channel.id != variables.sharedServers && !module.exports.isModo(message.member) &&
       (message.content.includes("discord.gg/") || message.content.includes("discord.com/invite") || message.content.includes("chat.whatsapp.com/"))) {

        message.delete();

        let embed = new MessageEmbed()
            .setColor(variables.colors.SuHex)
            .setTitle("❌ Votre message a été supprimé.")
            .setDescription(`Désolé ${message.member} ! Pour des raisons de sécurité, les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés sur le serveur.`)
            .setFooter({ text: "Contactez la modération pour partager un lien." });

        message.channel.send({ embeds: [embed] }).catch( (error) => utils.errorHandler(error, null));
    }

    // If the message mentions the bot: send a message
    if (message.content.includes(`<@${client.id}>`) || message.content.includes(`<@&${variables.roles.unibot}>`)) {
        let embed = new MessageEmbed()
            .setColor(variables.colors.SuHex)
            .setAuthor({ name: "C'est moi !" } )
            .setFooter({ text: 'Tapez "unibot help" pour obtenir la liste des commandes.' });

        message.channel.send({ embeds: [embed] }).catch( (error) => utils.errorHandler(error, null));
    }
}


module.exports.deleteOldLogs = () => {
    if (cache.deleteQueue == undefined) return;  // No deleteQueue created yet

    let today = new Date();
    let head = cache.deleteQueue[0];
    let logsChannel = client.channels.cache.get(variables.channels.logs);

    // If the head of the list show the same deletion date as today
    if (today.getMonth() == head.date.getMonth() && today.getDate() == head.date.getDate()) {
        for (let messageId of head.messages) {
            logsChannel.messages.fetch(messageId)
                .then( (message) => {
                    if (message == undefined) return;

                    message.delete();
                })
                .catch( (err) => {
                    console.log(`Could not fetch or auto delete a message from the logs channel (${err}).`)
                });
        }

        // Removing the head of list
        cache.deleteQueue.shift();
    }
}


module.exports.insertLogInCache = (messageId) => {
    let dateInOneMonth = new Date();
    dateInOneMonth.setMonth(dateInOneMonth.getMonth() + 1);

    if (cache.deleteQueue == undefined)
        cache.deleteQueue = [];

    let last = cache.deleteQueue.at(-1);

    if (last == undefined) {
        // Maybe deleteQueue == [] ? at(-1) would return undefined
        cache.deleteQueue.push({
            date: dateInOneMonth,
            messages: [messageId]
        });
    } else if (dateInOneMonth.getMonth() == last.date.getMonth() &&
               dateInOneMonth.getDate() == last.date.getDate()) {
        // An object with today's date already exists
        last.messages.push(messageId);
    } else {
        // Inserting a new object with today's date; basically the same as
        // if `last` was undefined but it is more clear to have simpler `if`
        cache.deleteQueue.push({
            date: dateInOneMonth,
            messages: [messageId]
        });
    }
}
