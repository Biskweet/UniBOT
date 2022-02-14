import { MessageEmbed } from 'discord.js';
import * as variables from '../utils/variables.js';


export async function help(message, command='') {
    let embedTitle, embedDesc, embedFooter, embedIcon;

    let embed = new MessageEmbed()

    if (command === '') {
        embedTitle = "Liste des commandes";
        embedDesc  = "```" +
                     " - send_info\n" +
                     " - ping\n" +
                     " - 8ball\n" +
                     " - answer" +
                     " - wiki\n" +
                     " - couleur (VIP)\n" +
                     " - clear (modération)\n" +
                     " - mute (modération)\n" +
                     " - unmute (modération)\n" +
                     " - destroy (modération)\n" +
                     " - batchban (modération)\n" +
                     " - kick (modération)\n" +
                     " - ban/unban (modération)\n"+
                     "```";
    }

    else if (command === "ping") {
        [embedTitle, embedDesc] = helpPing();
    }

    else if (command === "8ball") {
        [embedTitle, embedDesc] = help8ball();
    }

    else if (command === "couleur") {
        [embedTitle, embedDesc] = helpCouleur();
    }

    else if (command === "clear") {
        [embedTitle, embedDesc] = helpClear();
    }

    else if (command === "kick" || command === "ban") {
        [embedTitle, embedDesc] = helpKickBan();
    }

    else if (command === "unban") {
        [embedTitle, embedDesc] = helpUnban();
    }

    else if (command === "answer") {
        [embedTitle, embedDesc] = helpAnswer();
    }

    else if (command === "wiki") {
        [embedTitle, embedDesc] = helpWiki();
    }

    else if (command === "destroy") {
        [embedTitle, embedDesc] = helpDestroy();
    }

    else if (command === "mute") {
        [embedTitle, embedDesc] = helpMute();
    }

    else if (command === "unmute") {
        [embedTitle, embedDesc] = helpUnmute();
    }

    else if (command === "answer") {
        [embedTitle, embedDesc] = helpPrintCache();
    }

    else if (command === "batchban") {
        [embedTitle, embedDesc] = helpBatchban();
    }

    else {
        return;
    };

    embed.setTitle(embedTitle)
         .setDescription(embedDesc)
         .setFooter({ text: "Vous pouvez obtenir des informations sur une commande en tapant : unibot help [commande]"})
         .setColor(variables.colors.SuHex);

    message.channel.send({ embeds: [embed] });
}


function helpPing() {
    let embedTitle = "Help :arrow_right: __ping__";
    let embedDesc  = "Renvoie la latence en millisecondes du bot " +
                     "(souvent utilisé pour vérifier sa présence en ligne)."

    return [embedTitle, embedDesc];
}


function helpDestroy() {
    let embedTitle = "Help :arrow_right: __destroy__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Ferme la connexion et termine le processus du bot proprement.";   

    return [embedTitle, embedDesc];                  
}


function helpMute() {
    let embedTitle = "Help :arrow_right: __mute__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Attribue au membre le rôle <@&" + variables.roles.muted + "> au membre visé. " +
                     "Interdit indéfiniment au membre d'envoyer des messages. Argument optionnel : " +
                     "durée. Permet de spécifier un décompte pour révoquer l'interdiction automatiquement " +
                     "après un temps donné.\n\n" +
                     "Exemples d'utilisation :\n`unibot mute @Exemple#1234`\n`unibot mute @Exemple#1234 120`";

    return [embedTitle, embedDesc];
}


function helpUnmute() {
    let embedTitle = "Help :arrow_right: __mute__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Enlève le rôle <@&" + variables.roles.muted + "> au membre visé.\n\n" +
                     "Exemples d'utilisation :\n`unibot unmute @Exemple#1234`";

    return [embedTitle, embedDesc];
}


function helpPrintCache() {
    let embedTitle = "Help :arrow_right: __printCache__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Affiche le contenu du cache du programme (utile pour le débugage, ou s'il faut " +
                     "`unibot destroy` pour sauvegarder le contenu du cache).";

    return [embedTitle, embedDesc];
}


function helpBatchban() {
    let embedTitle = "Help :arrow_right: __batchban__\n";
    let embedDesc  = "Permet de bannir plusieurs membres en même temps à l'aide de leurs " +
                     "IDs (et à l'aide de leurs IDs seulement !).\n\n" +
                     "Exemple d'utilisation :`unibot batchban 123456789012345678 098765432109876543 010203040501020304`";

    return [embedTitle, embedDesc];
}


function help8ball() {
    let embedTitle = "Help :arrow_right: __8ball__";
    let embedDesc  = "Envoie une réponse ~~tirée au hasard~~ à la question passée en paramètre.\n\n" +
                     "Syntaxe de la commande : `unibot 8ball [question]`\n" +
                     "Exemple d'utilisation :\n`unibot 8ball Vais-je avoir une bonne note à mon partiel de grammaire ?`";

    return [embedTitle, embedDesc];
}


function helpCouleur() {
    let embedTitle = "Help :arrow_right: __couleur__";
    let embedDesc  = "__**(Réservé aux membres boosters)**__\n" +
                     "Crée un rôle de couleur et l'assigne au membre selon la couleur passée en paramètre.\n\n" +
                     "Exemple d'utilisation :\n`unibot couleur FFABF4`\n\n" +
                     "**Vous pouvez trouver le code hexadécimal de la couleur de votre choix __[ici](https://g.co/kgs/QLJzXN)__.**";

    return [embedTitle, embedDesc];
}


function helpClear() {
    let embedTitle = "Help :arrow_right: __clear__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Argument optionnel. Supprime les N derniers messages (sans compter celui de la commande). " +
                     "Par défaut 5 (maximum 75).\n\n" +
                     "Exemples d'utilisation :\n`unibot clear`\n`unibot clear 10`";

    return [embedTitle, embedDesc];
}


function helpKickBan() {
    let embedTitle = "Help :arrow_right: __kick__/__ban__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Exclut/bannit le membre passé en paramètre. Motif optionnel.\n\n" +
                     "Exemple d'utilisation :\n`unibot ban @Exemple#1234`\n`unibot kick @Exemple#1234 motif`\n\n" +
                     "Note : il peut être difficile/impossible de mentionner correctement " +
                     "l'utilisateur. Pour ce faire, utilisez `<@IdDuMembre>`.";

    return [embedTitle, embedDesc];
}


function helpUnban() {
    let embedTitle = "Help :arrow_right: __unban__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "\"Débannit\" (ou \"pardonne\") un membre banni.\n\n" +
                     "Exemple d'utilisation :\n`unibot unban @Exemple#1234`\n\n" +
                     "Note : il peut être difficile/impossible de mentionner correctement " +
                     "l'utilisateur. Pour ce faire, utilisez `<@IdDuMembre>`.";

    return [embedTitle, embedDesc];
}


function helpAnswer() {
    let embedTitle = "Help :arrow_right: __answer__";
    let embedDesc  = "Effectue une requête à Wolfram Alpha et renvoie la réponse s'il y en a.\n" +
                     "La requête doit être formulée en anglais.\n\n" +
                     "Exemple d'utilisation :\n`unibot answer area of France`\n`unibot answer solution of 3x^2 + 4 = ln(x)`";
    
    return [embedTitle, embedDesc]
}


function helpWiki() {
    let embedTitle = "Help :arrow_right: __wiki__";
    let embedDesc  = "Effectue une requête et renvoie l'introduction d'un article Wikipédia.\n" +
                     "Prend en paramètre la langue (optionnel, par défaut français, selon le formattage ICU, par exemple `en`, `fr`, `de`, etc.), et le titre de l'article (optionnel), cherche la correspondance la plus proche et renvoie " +
                     "l'introduction de celle-ci. Si aucun titre n'est fourni, renvoie un article choisi au hasard.\n\n" +
                     "Modèle d'utilisation : `unibot wiki [langue] [article]`.\n\n" +
                     "Exemple d'utilisation :\n`unibot wiki en` (article en français au hasard)\n" +
                     "unibot wiki en victor hugo` (article en anglais sur Victor Hugo)\n`\n`unibot wiki victor hugo` (article en françaissur Victor Hugo\n" +
                     "Obtenez la liste des langues [en cliquant ici](https://en.wikipedia.org/wiki/List_of_Wikipedias#Editions_overview)" +
                     " ou en lançant la commande `unibot wiki listelangues`.";

    return [embedTitle, embedDesc];
}
