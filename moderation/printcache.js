const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const { MessageEmbed } = require("discord.js");


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    let embed = new MessageEmbed();
    embed.setTitle("Bot cache on " + (new Date()).toString().slice(0, 24))
         .setDescription('```' + JSON.stringify(cache, null, 4) + '```')
         .setColor(variables.colors.SuHex);

    message.channel.send({ embeds: [embed] });
}
