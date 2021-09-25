import * as utils from '../utils/utils.js';
import { help } from './help.js';
import { SuHex } from '../utils/variables.js';


export function couleur(message, hexcode) {
    // if (!utils.isBooster(message.member)) {
    //     return;  // Not a server booster
    // }

    if (hexcode.length != 1) {
        return help(message, "couleur");  // Incorrect input
    }

    hexcode = hexcode[0].toUpperCase();
    if (hexcode[0] === "#") hexcode = hexcode.slice(1);
    // Removing `#` from the hexcode

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
            .catch(console.log);

        message.channel.send({ embeds: [{
            title: "Rôle ajouté !",
            thumbnail: {url: `https://singlecolorimage.com/get/${hexcode}/100x75`},
            description: `${message.author}, je viens de vous assigner le rôle ${newRole} !`,
            footer: {text: "Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !"},
            color: SuHex
        }]})
    }

    else {
        message.channel.send({embeds: [{
            title: "Création du rôle, veuillez patienter... <a:discordloading:891354025302315059>",
            color: SuHex
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
                        message.channel.send({ embeds: [{
                            title: "Rôle ajouté !",
                            thumbnail: {url: `https://singlecolorimage.com/get/${hexcode}/100x75`},
                            description: `${message.author}, je viens de vous assigner le rôle ${newRole} !`,
                            footer: {text: "Il peut arriver que votre rôle soit mal hiérarchisé. Si tel est le cas, contactez un modérateur !"},
                            color: SuHex
                        }]})

                    })

            })
            .catch ((error) => {
                message.channel.send("Une erreur s'est produite lors de la création du rôle !");
                console.log(error);
            });
    }
}


