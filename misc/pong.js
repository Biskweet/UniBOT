const { MessageEmbed } = require("discord.js");
const variables = require("../utils/variables.js");


module.exports = async (message, args) => {
    let embed = new MessageEmbed();
    embed.setTitle(`Ping ! :ping_pong: ${Date.now() - message.createdTimestamp} millisecondes.`)
         .setColor(variables.colors.SuHex);

    message.channel.send({ embeds: [embed] });
}
