import { SuHex } from '../utils/variables.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message, client) {
    if (utils.isModo(message.member)) {

        let embedTitle = ":smiling_face_with_tear: Au-revoir.";

        message.channel.send()
        .then( (reply) => {
            console.log("Shutting down.");

            client.destroy();
        });
    }
}


export function kick(message, reason) {
    if (utils.isModo(message.member)) {

        try {

            let member = message.mentions.members.first();

            if (!member.kickable) {  // Client does not have permission
                throw new Error("Permissions insuffisantes.");
            }

            let alert = "Vous avez été expulsé du serveur Discord Étudiant Sorbonne Université.";
            if (reason.length) {
                alert += "\n\nMotif : " + reason;
            }

            member.send(alert)
                .then(() => {
                    member.kick();
                })
                .catch(() => {
                    member.kick();
                    throw new Error("Error when sending message.") ;
                });
        }

        catch (error) {
            console.log("-------------------------\n", error, "\n-------------------------");
            message.channel.send("Il y a eu une erreur lors de l'expulsion des membres !\n" + error.message);
            message.react('❌');
            return;
        }; 
        message.react('✅');
    }
}


export function ban(message, reason) {
    if (utils.isModo(message.member)) {

        try {

            let member = message.mentions.members.first()

            if (!member.bannable) {  // Client does not have permission
                message.react('❌');
                message.channel.send("Permissions insuffisantes.");
                return;
            }

            let alert = "Vous avez été banni du serveur Discord Étudiant Sorbonne Université.";
            if (reason.length) {
                alert += "\n\nMotif : " + reason;
            }

            member.send(alert)
                .then(() => {
                    member.ban();
                })
                .catch(() => {
                    console.log("Error when sending message.") 
                    member.ban()
                        .then(console.log)
                });
        }

        catch (error) {
            console.log("-------------------------\n", error, "\n-------------------------");
            message.author.send("Il y a eu une erreur lors du bannissement du membre !");
            message.react('❌');
            return;
        };
        message.react('✅');
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


