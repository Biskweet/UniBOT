import { SuHex } from '../utils/variables.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message, client) {
    if (utils.isModo(message.member)) {

        let embedTitle = ":smiling_face_with_tear: Au-revoir.";

        message.channel.send( { embeds: [{
            title: embedTitle,
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
            console.log("-------------------------\n", error, "\n-------------------------");
            message.channel.send("Il y a eu une erreur lors de l'expulsion du membre !\n" + error.message);
            message.react('❌');
        }
    }
}


export function kick(message, reason) {
    if (utils.isModo(message.member)) {

        let member = message.mentions.members.first();

        try {
            if (!member.kickable) {  // Client does not have permission
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
            console.log("-------------------------\n", error, "\n-------------------------");
            message.channel.send("Il y a eu une erreur lors du bannissement du membre !\n" + error.message);
            message.react('❌');
        }
    }
}


export function unban(message, userId) {

    message.guild.bans.remove(userId)
        .then( (user) => {
            client.channels.cache.get("776802470089064510").send(`${user} a été pardonné (user was unbanned).`);
            message.react('✅');
        })

        .catch( (error) => {
            console.log("-------------------------\n", error, "\n-------------------------");
            message.react('❌');
        })
}


export function filterMessage(message) {

    if (message.channel.id != "754653542178095195" && (message.content.includes("discord.gg/") ||
                                                       message.content.includes("https://chat.whatsapp.com/"))) {
       
        message.delete();

        message.channel.send({ embeds: [{
            title: '❌ Votre message a été supprimé.',
            description: "Désolé ! Les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés dans le serveur.",
            footer: "Contactez la modération pour partager un lien.",
            color: SuHex
        }]})
    }
}



