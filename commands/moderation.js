import { SuHex } from '../utils/variables.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message, client) {
    if (utils.isModo(message.member)) {

        message.channel.send(":smiling_face_with_tear: Au-revoir.")
        .then( (reply) => {
            console.log("Shutting down.");

            client.destroy();
        });
    }
}


export function kick(message, reason) {
    if (utils.isModo(message.member)) {

        try {

            let member = message.mentions.members.first()

            if (!member.kickable) {  // Client does not have permission
                message.react('❌');
                message.channel.send("Permissions insuffisantes.");
                return;
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
                    console.log("Error when sending message.") 
                    member.kick()
                        .then(console.log)
                });
        }

        catch (error) {
            console.log("-------------------------\n", error, "\n-------------------------");
            message.author.send("Il y a eu une erreur lors de l'expulsion des membres !");
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


