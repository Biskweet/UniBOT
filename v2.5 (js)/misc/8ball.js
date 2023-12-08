const variables = require("../utils/variables.js");
const { MessageEmbed } = require("discord.js");


module.exports = async (message, args) => {
    let question = args.slice(2).join(' ');

    let embed = new MessageEmbed().setColor(variables.colors.SuHex);

    if (question === '') {
        embed.setTitle("Pose la question qui te brûle.");
    } else {
        embed.setAuthor({ name: "Question : " + question, iconURL: message.author.displayAvatarURL(), url: message.url })
             .setDescription(variables.eightBallAnswers[Math.floor(Math.random() * variables.eightBallAnswers.length)]);
    }

    message.channel.send({ embeds: [embed] });
}
