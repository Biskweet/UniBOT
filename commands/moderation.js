import * as variables from '../utils/variables.js';
import { MessageEmbed } from 'discord.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message) {
    if (utils.isModo(message.member)) {
        message.channel.send({ embeds: [{
            title: ":headstone: Destruction du client.",
            color: variables.colors.SuHex
        }]})

            .then( (msg) => {
                console.log(`====================\nShutting down (online for ${(Date.now() - client.readyTimestamp)/1000} sec).`);
                client.destroy();
                process.exit();
            })
    }
}


export async function clear(message, args) {
    if (utils.isModo(message.member)) {

        if (args.length != 1 || isNaN(args[0])) {
            return; // Incorrect input but I'm too lazy for better handling
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
        mutedRole = message.guild.roles.cache.find( (role) => role.id == "850707162561118229" );

        if (target == undefined) utils.errorHandler({message: "Could not find target."}, message);
        if (mutedRole == undefined) utils.errorHandler({message: "No such role."}, message);

        target.roles.add(mutedRole).then( (memb) => {message.react('✅');} ) ;

        if (args.length > 0 && !isNaN(args[0])) {
            let duration = parseInt(args[0]) * 1000;

            if (duration > 500000) {
                utils.errorHandler({message: "Cannot mute for longer than 500'000 seconds (user was muted indefinitely)."}, message);
                return;
            }

            setTimeout( () => {
                unmute(message).catch( (error) => {utils.errorHandler(message, error);} );
            }, duration);
        }
    }
}


export async function unmute(message) {
    if (utils.isModo(message.member)) {
        let target, mutedRole;

        target = message.mentions.members.first();
        mutedRole = message.guild.roles.cache.find((role) => role.id == "850707162561118229");

        if (target == undefined) utils.errorHandler({message: "Could not find target."}, message);
        if (mutedRole == undefined) utils.errorHandler({message: "No such role."}, message);

        target.roles.remove(mutedRole).then( (memb) => {message.react('✅');} ).catch( (error) => {utils.errorHandler(error, message)} );
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
                .setColor(variables.colors.SuHex);

            message.channel.send( { embeds: [embed] } );
        }
    }
}


export async function ban(message, reason) {
    if (utils.isModo(message.member)) {

        // Ban by user ID
        if (message.mentions.users.size == 0) {
            let targetId = message.content.split(' ')[2];

            message.guild.members.ban(targetId, {reason: reason})
                .then( (banInfo) => message.react('✅') )
                .catch( (err) => {
                    utils.errorHandler({message: `Could not ban user with ID ${targetId}`}, message);

                    let embed = new MessageEmbed()
                        .setTitle("❌ Il y a eu une erreur lors du bannissement du membre : ")
                        .setDescription(error.message)
                        .setColor(variables.colors.SuHex);

                    message.channel.send( { embeds: [embed] } );
            });
            return;
        }

        // Ban by member mention
        let target = message.mentions.users.first();

        let alert = "Vous avez été banni du serveur Discord Étudiant Sorbonne Université.";
        if (reason.length > 0) {
            alert += "\n\nMotif : " + reason;
        }

        target.send(alert).catch( (err) => console.error(`Could not send ban alert to user ${target.user.tag}`) );

        target.ban({reason: reason})
            .then( (guildMember) => message.react('✅') )
            .catch( (err) => {
                utils.errorHandler({message: `Could not ban user ${target.user.tag}`}, message);

                let embed = new MessageEmbed()
                    .setTitle("❌ Il y a eu une erreur lors du bannissement du membre : ")
                    .setDescription(error.message)
                    .setColor(variables.colors.SuHex);

                message.channel.send( { embeds: [embed] } );
            });
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
    if (message.channel.id != "754653542178095195" && 
        (message.content.includes("discord.gg/") || message.content.includes("chat.whatsapp.com/"))) {
       
        message.delete();

        let embed = new MessageEmbed()
            .setColor(variables.colors.SuHex)
            .setTitle("❌ Votre message a été supprimé.")
            .setDescription(`Désolé ${message.member} ! Pour des raisons de sécurité, les liens Discord et WhatsApp doivent impérativement être vérifiés par un modérateur pour être partagés sur le serveur.`)
            .setFooter("Contactez la modération pour partager un lien.");

        message.channel.send( { embeds: [embed] } );
    }

    // If the message mentions UniBOT or its dedicated role, send a message
    if (message.mentions.has("485490695604273153") || message.mentions.has("869605212078350347")) {
        let embed = new MessageEmbed()
                            .setColor(variables.colors.SuHex)
                            .setAuthor("C'est moi !")
                            .setFooter("Tapez `unibot help` pour obtenir la liste des commandes.");

        message.channel.send( { embeds: [embed] } );
    }
}
