const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const { MessageEmbed } = require('discord.js');


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    let embed = new MessageEmbed();
    embed.setTitle(":headstone: Destruction du client.")
         .setColor(variables.colors.SuHex);

    message.channel.send({ embeds: [embed] })
        .then( (msg) => {
            console.log(`====================\nShutting down (online for ${(Date.now() - client.readyTimestamp) / 1000} sec).`);
            client.destroy();
            process.exit(0);
        });
}
