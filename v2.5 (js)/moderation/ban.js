const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const { MessageEmbed } = require('discord.js');


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    let reason = args.slice(3).join(' ');

    // Ban by user ID
    if (message.mentions.users.size == 0) {
        let targetId = args[2];

        message.guild.members.ban(targetId, { reason: reason })
            .then( (banInfo) => message.react('✅'))
            .catch( (error) => {
                utils.errorHandler({ message: `Could not ban user with ID ${targetId} (${error.message})` }, message);

                let embed = new MessageEmbed();
                embed.setTitle("❌ Il y a eu une erreur lors du bannissement du membre :")
                     .setDescription(error.message + ` (${targetId})`)
                     .setColor(variables.colors.SuHex);

                message.channel.send({ embeds: [embed] });
            });
    }

    // Ban by member mention
    else {
        let target = message.mentions.members.first();

        let alert = "Vous avez été banni du serveur Discord Étudiant Sorbonne Université.";
        if (reason.length > 0) {
            alert += "\n\nMotif : " + reason;
        }

        try {
            await target.send(alert);
        } catch (error) {
            console.error(`Could not send ban alert to user ${target.user.tag} (${error.message})`);
        }

        target.ban({ reason: reason })
            .then( (guildMember) => message.react('✅'))
            .catch( (error) => {
                utils.errorHandler({ message: `Could not ban user ${target.user.tag} (${error.message})` }, message);

                let embed = new MessageEmbed()
                    .setTitle("❌ Il y a eu une erreur lors du bannissement du membre : ")
                    .setDescription(error.message)
                    .setColor(variables.colors.SuHex);

                message.channel.send({ embeds: [embed] });
            });
    }
}
