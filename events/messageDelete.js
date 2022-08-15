const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const axios = require("axios");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");


module.exports = async (message) => {
    if (message.channel.type == "DM" || message.author?.bot || utils.isModo(message.member)) {
        return;  // Do not log messages from bots or moderators, or from DM channels
    }

    let logsChannel = client.channels.cache.get(variables.channels.deletedMsgs);

    let embed = new MessageEmbed();
    embed.setColor(variables.colors.SuHex)
         .setDescription(`**🗑️ | Message supprimé dans ${message.channel} :**\n${message.content}\n\n`)
         .setAuthor({ name: `${message.author?.tag} (Author ID: ${message.author?.id})`, iconURL: message.author?.displayAvatarURL() })
         .setFooter({ text: `Message ID : ${message.id} • ${new Date().toLocaleString("fr-FR")}` });

    logsChannel.send({ embeds: [embed] }).then( (message) => utils.insertLogInCache(message.id));

    // End function here if there is no attachment
    if (message.attachments.size == 0) return;

    // Add all attachments of the message
    let attachedFiles = [];
    let requests = [];

    for (let attachment of message.attachments) {   
        requests.push(axios({
            method: "get",
            url: attachment[1].url,
            responseType: "arraybuffer"
        })
        .then( (response) => {
            let filePath = utils.generateFileName(attachment[1].url);

            attachedFiles.push(filePath);
            fs.writeFile(filePath, response.data, (error) => {
                if (error) {
                    utils.errorHandler(error, null);
                }
            });
        })
        .catch( (error) => utils.errorHandler(error, null)));
    }

    // Waiting all downloads to finish
    Promise.allSettled(requests)
        .then( async (output) => {

            return logsChannel.send({ content: "pièces-jointes :", files: attachedFiles });

        })
        .then( (message) => {

            utils.insertLogInCache(message.id);

            embed = new MessageEmbed();
            embed.setColor(variables.colors.SuHex)
                 .setAuthor({ name: "(fin des pièces-jointes)" });

            return logsChannel.send({ embeds: [embed] });

        })
        .then( (message) => {

            utils.insertLogInCache(message.id);

            // Deleting all files after upload
            for (let file of attachedFiles) {
                fs.unlink(file, (error) => {
                    if (error) {
                        utils.errorHandler(error, null);
                    } 
                });
            }                

        });
}

