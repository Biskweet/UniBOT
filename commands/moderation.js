import { SuHex } from '../utils/variables.js';
import { MessageEmbed } from 'discord.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message) {
    if (utils.isModo(message.member)) {

        message.channel.send({ embeds: [{
            title: ":firecracker: Destruction du client.",
            color: SuHex
        }]})

            .then((msg) => {
                console.log("Shutting down.");
                client.destroy();
            })
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

            target.kick();
            message.react('✅');

            target.send(alert)
                .catch((err) => {console.log(`Could not send kick alert to ${message.member.user.tag}`)})

        }

        catch (error) {
            utils.errorHandler(error, message);

            let embed = new MessageEmbed()
                .setTitle("Il y a eu une erreur lors de l'expulsion du membre : ")
                .setDescription(error.message)
                .setColor(SuHex);

            message.channel.send({ embeds: [embed]});
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
                .catch((err) => {console.log(`Could not send kick alert to ${member.user.tag}`)})

        }

        catch (error) {
            utils.errorHandler(error, message);

            let embed = new MessageEmbed()
                .setTitle("Il y a eu une erreur lors du bannissement du membre : ")
                .setDescription(error.message)
                .setColor(SuHex)

            message.channel.send({ embeds: [embed]});
        }
    }
}


export async function unban(message, userId) {
    if (utils.isModo(message.member)) {

        message.guild.members.unban(userId)
            .then( (user) => {
                message.react('✅');
            })
            .catch(utils.errorHandler, message);
    }
}


export async function filterMessage(message) {
    if (message.channel.id != "754653542178095195" && !utils.isModo(message.member) &&
       (message.content.includes("discord.gg/") || message.content.includes("https://chat.whatsapp.com/"))) {
       
        message.delete();

        let embed = new MessageEmbed()
            .setTitle("❌ Votre message a été supprimé.")
            .setDescription("Désolé ! Pour des raisons de sécurité, les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés sur le serveur.")
            .setFooter("Contactez la modération pour partager un lien.")
            .setColor(SuHex);

        message.channel.send({ embeds: [embed]})
    }
}
