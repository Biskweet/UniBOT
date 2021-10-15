import { help } from './help.js';
import { MessageEmbed } from 'discord.js';
import * as variables from '../utils/variables.js';
import * as utils from '../utils/utils.js';


export async function couleur(message, hexcode) {
    // if (!utils.isBooster(message.member)) {
    //     return;  // Not a server booster
    // }

    if (hexcode.length != 1) {  // Incorrect input
        return help(message, "couleur");
    }

    let embed = new MessageEmbed().setColor(variables.SuHex)

    hexcode = hexcode[0].toUpperCase();
    if (hexcode[0] === "#") hexcode = hexcode.slice(1);
    // Removing `#` from the hexcode

    if (hexcode.length != 6) {
        embed.setDescription("Votre code hexadécimal doit faire 6 caractères (exemples : `#F0230F`, `8A012E`, etc.)")
        return message.channel.send({ embeds: [embed]});
    }

    let re = /[0-9A-F]{6}/g;

    if (!re.test(hexcode)) {
        return help(message, "couleur");  // Not a valid hex code
    }


    // =====

    let oldRole = message.member.roles.cache.find((role) => role.name.startsWith("VIP "));
    if (oldRole !== undefined) {
        message.member.roles.remove(oldRole.id);
    }

    let newRole = message.guild.roles.cache.find((role) => role.name === "VIP " + hexcode);

    if ( newRole !== undefined ) {
        message.member.roles.add(newRole)
            .catch(utils.errorHandler, message);

        embed.setTitle("Rôle ajouté !")
             .setThumbnail(`https://singlecolorimage.com/get/${hexcode}/100x75`)
             .setDescription(`${message.author}, je viens de vous assigner le rôle ${newRole} !`)
             .setFooter("Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !")

        message.channel.send({ embeds: [embed]});
    }

    else {
        message.channel.send({embeds: [{
            title: "Création du rôle, veuillez patienter... <a:discordloading:891354025302315059>",
            color: variables.SuHex
            }]
        })
            .then( (loadingMsg) => {        
                message.guild.roles.create({
                    name: "VIP " + hexcode,
                    color: hexcode,
                    position: Array.from(message.guild.roles.cache).length - 4
                })

                    .then( (newRole) => {
                        message.member.roles.add(newRole);
                        loadingMsg.delete();

                        embed.setTitle("Rôle ajouté !")
                             .setThumbnail(`https://singlecolorimage.com/get/${hexcode}/100x75`)
                             .setDescription(`${message.author}, je viens de vous assigner le rôle ${newRole} !`)
                             .setFooter("Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !")

                        message.channel.send({ embeds: [embed]});
                    })

            })
            .catch( (error) => {
                embed.setTitle("Une erreur s'est produite lors de la création du rôle !");
                message.channel.send({embeds: [{embed}]});
                
                utils.errorHandler(error, message);
            });
    }
}


