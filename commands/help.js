import { SuHex } from '../utils/variables.js';


export function help(message, command='') {
    let embedTitle, embedDesc, embedFooter, embedIcon;

    embedFooter = {text: "Vous pouvez obtenir des informations sur une commande en tapant : unibot help [commande]"};

    if (command === '') {
        embedTitle = "Liste des commandes";
        embedDesc  = "send_info\n" +
                     "ping\n" +
                     "8ball\n" +
                     "wiki\n" +
                     "couleur (VIP)\n" +
                     "clear (modération)\n" +
                     "kick (modération)\n" +
                     "ban/unban (modération)\n"+
                     "create_embed/edit_embed (modération)";
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

    else if (command === "wiki") {
        [embedTitle, embedDesc] = helpWiki();
    }

    else {
        return
    };

    message.channel.send({ embeds: [{
        title: embedTitle,
        description: embedDesc,
        footer: embedFooter,
        color: SuHex
    }]})
}


export function helpPing() {
    let embedTitle = "Help :arrow_right: __ping__";
    let embedDesc  = "Renvoie la latence en millisecondes du bot " +
                     "(souvent utilisé pour vérifier sa présence en ligne)."

    return [embedTitle, embedDesc];
}


export function help8ball() {
    let embedTitle = "Help :arrow_right: __8ball__";
    let embedDesc  = "Envoie une réponse ~~tirée au hasard~~ à la question passée en paramètre.\n\n" +
                     "Syntaxe de la commande : `unibot 8ball [question]`\n" +
                     "Exemple d'utilisation :\n`unibot 8ball Vais-je avoir une bonne note à mon partiel de grammaire ?`"

    return [embedTitle, embedDesc];
}


export function helpCouleur() {
    let embedTitle = "Help :arrow_right: __couleur__";
    let embedDesc  = "__**(Réservé aux membres boosters)**__\n" +
                     "Crée un rôle de couleur et l'assigne au membre selon la couleur passée en paramètre.\n\n" +
                     "Exemple d'utilisation :\n`unibot couleur C72CB0`\n\n" +
                     "Vous pouvez trouver le code hexadécimal de la couleur de votre choix __**[ici](https://g.co/kgs/QLJzXN)**__."

    return [embedTitle, embedDesc];
}


export function helpClear() {
    let embedTitle = "Help :arrow_right: __clear__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Argument optionnel. Supprime les N derniers messages (sans compter celui de la commande). " +
                     "Par défaut 5 (maximum 75).\n\n" +
                     "Exemples d'utilisation :\n`unibot clear`\n`unibot clear 10`"

    return [embedTitle, embedDesc];
}


export function helpKickBan() {
    let embedTitle = "Help :arrow_right: __kick__/__ban__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "Exclut/bannit le membre passé en paramètre. Motif optionnel.\n\n" +
                     "Exemple d'utilisation :\n`unibot ban @Exemple#1234`\n`unibot kick @Exemple#1234 motif`\n\n" +
                     "Note : il peut être difficile/impossible de mentionner correctement " +
                     "l'utilisateur. Pour ce faire, utilisez `<@IdDuMembre>`."

    return [embedTitle, embedDesc];
}


export function helpUnban() {
    let embedTitle = "Help :arrow_right: __unban__";
    let embedDesc  = "__**(Réservé à la modération)**__\n" +
                     "\"Débannit\" ou \"pardonne\" un membre banni.\n\n" +
                     "Exemple d'utilisation :\n`unibot unban @Exemple#1234`\n\n" +
                     "Note : il peut être difficile/impossible de mentionner correctement " +
                     "l'utilisateur. Pour ce faire, utiliser `<@IdDuMembre>`.";

    return [embedTitle, embedDesc];
}


export function helpWiki() {
    let embedTitle = "Help :arrow_right: __wiki__";
    let embedDesc  = "Effectue une requête et renvoie l'introduction d'un article Wikipédia.\n" +
                     "Prend en paramètre la langue (requis, selon le formattage ICU, par exemple `en`, `fr`, `de`, etc.), et le titre de l'article (optionnel), cherche la correspondance la plus proche et renvoie " +
                     "l'introduction de celle-ci. Si aucun titre n'est fourni, renvoie un article choisi au hasard.\n\n" +
                     "Modèle d'utilisation : `unibot wiki [langue] [article]`.\n\n" +
                     "Exemple d'utilisation :\n`unibot wiki en` (article en anglais au hasard)\n`unibot wiki fr victor hugo` (article français sur Victor Hugo).\n\n" +
                     "[Obtenir la liste des langues disponibles](https://en.wikipedia.org/wiki/List_of_Wikipedias#Editions_overview)"

    return [embedTitle, embedDesc];
}
