import { SuHex } from '../utils/variables.js';
import { MessageEmbed } from 'discord.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message) {
    if (utils.isModo(message.member)) {
        message.channel.send({ embeds: [{
            title: ":headstone: Destruction du client.",
            color: SuHex
        }]})

            .then((msg) => {
                console.log(`====================\nShutting down (online for ${(Date.now() - client.readyTimestamp)/1000} sec).`);
                client.destroy();
                process.exit();
            })
    }
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
                .setColor(SuHex);

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
                .setColor(SuHex)

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
            .setDescription("Désolé ! Pour des raisons de sécurité, les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés sur le serveur.")
            .setFooter("Contactez la modération pour partager un lien.")
            .setColor(SuHex);

        message.channel.send({ embeds: [embed]});
    }
}



