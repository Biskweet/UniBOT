import { SuHex } from '../utils/variables.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message) {
    if (utils.isModo(message.member)) {

        message.channel.send( { embeds: [{
            title: "Destruction du client.",
            color: SuHex
        }]})
            .then( (reply) => {
                console.log("Shutting down.");

                client.destroy();
             });
    }
}


export function kick(message, reason) {
    if (utils.isModo(message.member)) {

        let member = message.mentions.members.first();

        try {
            if (!member.kickable) {  // Client does not have permission
                    throw new Error("Permissions insuffisantes.");
            }
        
            let alert = "Vous avez été expulsé du serveur Discord Étudiant Sorbonne Université.";
            if (reason.length) {
                alert += "\n\nMotif : " + reason;
            }

            member.kick();
            message.react('✅');

            member.send(alert)
                .catch((err) => {console.log(`Could not send kick alert to ${member.user.tag}`)})

        }

        catch (error) {
            utils.errorHandler(error, message);
            message.channel.send({ embeds: [{
                title: "Il y a eu une erreur lors de l'expulsion du membre : " + error.message,
                color: SuHex
            }]});
        }
    }
}


export function ban(message, reason) {
    if (utils.isModo(message.member)) {

        let member = message.mentions.members.first();

        try {
            if (!member.bannable) {  // Client does not have permission
                    throw new Error("Permissions insuffisantes.");
            }
        
            let alert = "Vous avez été banni du serveur Discord Étudiant Sorbonne Université.";
            if (reason.length) {
                alert += "\n\nMotif : " + reason;
            }

            member.ban();
            message.react('✅');

            member.send(alert)
                .catch((err) => {console.log(`Could not send kick alert to ${member.user.tag}`)})

        }

        catch (error) {
            utils.errorHandler(error, message);
            message.channel.send({ embeds: [{
                title: "Il y a eu une erreur lors du bannissement du membre : " + error.message,
                color: SuHex
            }]});
        }    }
}


export function unban(message, userId) {
    if (utils.isModo(message.member)) {

        message.guild.members.unban(userId)
            .then( (user) => {
                message.react('✅');
            })

            .catch(utils.errorHandler, message);
    }
}


export function filterMessage(message) {

    if (message.channel.id != "754653542178095195" && !utils.isModo(message.member) &&
       (message.content.includes("discord.gg/") || message.content.includes("https://chat.whatsapp.com/"))) {
       
        message.delete();

        message.channel.send({ embeds: [{
            title: '❌ Votre message a été supprimé.',
            description: "Désolé ! Les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés sur le serveur.",
            footer: "Contactez la modération pour partager un lien.",
            color: SuHex
        }]})
    }
}



