const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const help = require("./help.js");
const { MessageEmbed } = require("discord.js");


module.exports = async (message, args) => {
    if (!utils.isVIP(message.member)) {
        return;  // Not a server booster
    }

    let hexcode = args.slice(2);

    if (hexcode.length != 1) {  // Incorrect input
        return help(message, "couleur");
    }

    let embed = new MessageEmbed().setColor(variables.colors.SuHex)

    hexcode = hexcode[0].toUpperCase();
    if (hexcode[0] === '#') hexcode = hexcode.slice(1);
    // Removing `#` from the hexcode

    if (hexcode.length != 6) {
        embed.setDescription("Votre code hexadécimal doit faire 6 caractères (exemples : `#F0230F`, `8A012E`, etc.)");
        return message.channel.send({ embeds: [embed] });
    }

    let re = /[0-9A-F]{6}/g;

    if (!re.test(hexcode)) {
        return help(message, "couleur");  // Not a valid hex code
    }


    // =====

    let oldRole = message.member.roles.cache.find( (role) => role.name.startsWith("VIP "));
    if (oldRole !== undefined) {
        message.member.roles.remove(oldRole.id);
    }

    let newRole = message.guild.roles.cache.find( (role) => role.name === "VIP " + hexcode);

    if (newRole !== undefined) {
        message.member.roles.add(newRole)
            .catch( (error) => utils.errorHandler(error, message));

        embed.setTitle("Rôle ajouté !")
             .setThumbnail(`https://singlecolorimage.com/get/${hexcode}/100x75`)
             .setDescription(`${message.author}, je viens de vous assigner le rôle ${newRole} !`)
             .setFooter({ text: "Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !" })

        message.channel.send({ embeds: [embed] });
    
    } else {

        message.channel.send({ embeds: [{
            title: "Création du rôle, veuillez patienter... <a:discordloading:873989182668800001>",
            color: variables.colors.SuHex
            }]

        }).then( (loadingMsg) => {        

            message.guild.roles.create({
                name: "VIP " + hexcode,
                color: hexcode,
                position: message.guild.roles.cache.size - 21
            })

        }).then( (newRole) => {

            message.member.roles.add(newRole);
            loadingMsg.delete();

            embed.setTitle("Rôle ajouté !")
                 .setThumbnail(`https://singlecolorimage.com/get/${ hexcode }/100x75`)
                 .setDescription(`${ message.author }, je viens de vous assigner le rôle ${ newRole } !`)
                 .setFooter({ text: "Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !" })

            message.channel.send({ embeds: [embed] });

        }).catch( (error) => {
            embed.setTitle("Une erreur s'est produite lors de la création du rôle !");
            message.channel.send({ embeds: [embed] });
                
            utils.errorHandler(error, message);
        });
    }
}
