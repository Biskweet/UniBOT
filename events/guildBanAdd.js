const variables = require('../utils/variables.js');
const { MessageEmbed } = require('discord.js');


module.exports = async (guildBan) => {
    let embed = new MessageEmbed();
    embed.setAuthor({ name: guildBan.user.tag, iconURL: guildBan.user.displayAvatarURL() })
         .setDescription(`${guildBan.user} a été banni(e) du serveur.`)
         .setColor(variables.colors.Red)
         .setThumbnail(guildBan.user.displayAvatarURL());

    client.channels.cache.get(variables.channels.logs).send({ embeds: [embed] });
}
