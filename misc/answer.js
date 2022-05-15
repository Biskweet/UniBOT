const WolframAlphaAPI = require("wolfram-alpha-api");
const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const dotenv = require("dotenv");
const { MessageEmbed } = require("discord.js");


dotenv.config();


const waAPI = WolframAlphaAPI(process.env.WOLFRAMALPHA_TOKEN);


module.exports = async (message, args) => {
    let embed = new MessageEmbed().setColor(variables.colors.SuHex);

    let question = args.slice(2).join(' ');

    if (question.length === 0) {
        message.react('❌');
        embed.setTitle("Aucune question posée.");
        return message.channel.send({ embeds: [embed] });
    }

    waAPI.getShort(question.replaceAll('?', ''))
        .then( (result) => {
            let embed = new MessageEmbed()
                .setColor(16345394)
                .setAuthor({ name: utils.capitalize(question), iconURL: message.author.displayAvatarURL() })
                .setDescription(result)
                .setFooter({ text: "Powered by WolframAlpha", iconURL: variables.WolframAlphaIcon })

            message.channel.send({ embeds: [embed] });
        })

        .catch( (error) => {
            message.react('❌');

            if (error.message === "Wolfram|Alpha did not understand your input") {
                message.react('❌');
                embed.setTitle("Wolfram Alpha did not understand your input.")
                     .setFooter({ text: "😕 Maybe it can't answer that." });
            } else {
                embed.setTitle(error.message.replaceAll('|', '') + '.');
            }
            
            message.channel.send({ embeds: [embed] });
        });
}
