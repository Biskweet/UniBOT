import * as variables from '../utils/variables.js';
import { MessageEmbed } from 'discord.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message) {
    if (utils.isModo(message.member)) {
        message.channel.send({ embeds: [{
            title: ":headstone: Destruction du client.",
            color: variables.SuHex
        }]})

            .then((msg) => {
                console.log(`====================\nShutting down (online for ${(Date.now() - client.readyTimestamp)/1000} sec).`);
                client.destroy();
                process.exit();
            })
    }
}


export async function updateWelcomeMessage(action, member) {
    // New Student needs to be welcomed
    client.channels.cache.get("893995887758540810").messages.fetch("894011083029889034")
        .then( (message) => {
            if (action === "append") {
                if (message.content === 'Nothing yet.') {
                    var edit = `${member}`;
                }
                else {
                    var edit = message.content + ` ${member}`;
                }

                message.edit(edit)
                    .catch( (error) => {utils.errorHandler(error, {content: "<error while updating welcome message>"});} );

                client.channels.cache.get("893995887758540810").send("New member to be welcomed.")
                    .then( (alert) => {
                        setTimeout(() => {
                            alert.delete();
                        }, 500);
                });
            }
    

            // Not welcomed Student left the server
            else if (action === "remove") {
                if ((message.content.split("@").length - 1) > 1)
                    message.edit(message.content.replaceAll(`${member}`, '').replaceAll('  ', ' '));
                else
                    message.edit("Nothing yet.");
            }

            // All Students are welcomed, reset the queue
            else if (action === "reset") {
                if (utils.isModo(member)) {
                    message.edit('Nothing yet.');
                }
            }
        })

        .catch( (error) => {utils.errorHandler(error, {content: "<error while updating welcome message>"});} );
}


export async function clear(message, args) {
    if (utils.isModo(message.member)) {

        if (args.length != 1 || isNaN(args[0])) {
            return; // Incorrect input but I'm too lazy for debug
        }

        let amount = parseInt(args[0]);

        if (amount > 75) {
            message.react('❌');
            message.channel.send("Impossible de supprimer plus de 75 messages à la fois.")
                .then( (errMsg) => {
                    setTimeout(() => {
                        errMsg.delete();
                    }, 5000);
                });
            return;
        }

        message.channel.messages.fetch({ limit: (amount+1) })
            .then((messages) => {
                message.channel.bulkDelete(messages);
            })
            .catch( (error) => {utils.errorHandler(error, message);} );
    }
}


export async function mute(message, args) {
    if (utils.isModo(message.member)) {
        let target, mutedRole;

        target = message.mentions.members.first();
        mutedRole = message.guild.roles.cache.find((role) => role.id == "850707162561118229");

        target.roles.add(mutedRole);

        if (args.length > 0 && !isNaN(args[0])) {
            let duration = parseInt(args[0]) * 1000;

            setTimeout( () => {
                target.roles.remove(mutedRole);
            }, duration).catch( (error) => {utils.errorHandler(message, error)} );
        }
    }
}


export async function unmute(message) {
    if (utils.isModo(message.member)) {
        let target, mutedRole;

        target = message.mentions.members.first();
        mutedRole = message.guild.roles.cache.find((role) => role.id == "850707162561118229");

        try {
            target.roles.remove(mutedRole);
        }

        catch (error) {
            await utils.errorHandler(message, error);
        }
    }
}


export async function kick(message, reason) {
    if (utils.isModo(message.member)) {
        let target = message.mentions.members.first();

        try {
            if (!target.kickable) {  // Client does not have permission
                    throw new Error("Permissions insuffisantes.");
            }
        
            let alert = "Vous avez été expulsé du serveur Discord Étudiant Sorbonne Université.";
            if (reason.length !== 0) {
                alert += "\n\nMotif : " + reason;
            }
            
            target.send(alert)
                .catch((err) => {console.log(`Could not send kick alert to ${target.user.tag}`);})

            target.kick();
            message.react('✅');
        }

        catch (error) {
            utils.errorHandler(error, message);

            let embed = new MessageEmbed()
                .setTitle("Il y a eu une erreur lors de l'expulsion du membre : ")
                .setDescription(error.message)
                .setColor(variables.SuHex);

            message.channel.send({ embeds: [embed] });
        }
    }
}


export async function ban(message, reason) {
    if (utils.isModo(message.member)) {
        let target = message.mentions.members.first();

        try {
            if (!target.bannable) {  // Client does not have permission
                    throw new Error("Permissions insuffisantes.");
            }
        
            let alert = "Vous avez été banni du serveur Discord Étudiant Sorbonne Université.";
            if (reason.length) {
                alert += "\n\nMotif : " + reason;
            }

            target.ban();
            message.react('✅');

            target.send(alert)
                .catch((err) => {console.log(`Could not send kick alert to ${target.user.tag}`)});
        }

        catch (error) {
            utils.errorHandler(error, message);

            let embed = new MessageEmbed()
                .setTitle("Il y a eu une erreur lors du bannissement du membre : ")
                .setDescription(error.message)
                .setColor(variables.SuHex)

            message.channel.send({ embeds: [embed] });
        }
    }
}


export async function unban(message, userId) {
    if (utils.isModo(message.member)) {

        message.guild.members.unban(userId)
            .then( (user) => {message.react('✅');})
            .catch( (error) => {utils.errorHandler(error, message);} );
    }
}


export async function filterMessage(message) {
    if (message.channel.id != "754653542178095195" && !utils.isModo(message.member) &&
       (message.content.includes("discord.gg/") || message.content.includes("https://chat.whatsapp.com/"))) {
       
        message.delete();

        let embed = new MessageEmbed()
            .setTitle("❌ Votre message a été supprimé.")
            .setDescription(`Désolé ${message.member} ! Pour des raisons de sécurité, les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés sur le serveur.`)
            .setFooter("Contactez la modération pour partager un lien.")
            .setColor(variables.SuHex);

        message.channel.send({ embeds: [embed]});
    }
}
