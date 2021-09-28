import { MessageEmbed } from 'discord.js';
import { help } from './help.js';
import axios from 'axios';
import WolframAlphaAPI from 'wolfram-alpha-api';
import * as variables from '../utils/variables.js';
import * as utils from '../utils/utils.js';


const waAPI = WolframAlphaAPI('AQLPTV-R88TU6G8PX');


export async function ping(message) {
    message.channel.send(
        {embeds: [{
           color: variables.SuHex,
           title: `Pong ! :ping_pong: ${Date.now() - message.createdTimestamp} millisecondes.`}]
        })
}


export async function sendInfo(message) {
    let embedDesc = "**channel:** " + message.channel +
                    "\n**server:** " + message.guild.name +
                    "\n**user:** " + message.author.tag
    message.channel.send( {embeds: [{
        color: variables.SuHex,
        description: embedDesc
    }]})
}


export async function eightBall(message, question) {
    let embedAuthor, embedDesc;

    question = question.join(" ");

    if (question === '') {
        embedAuthor = "Pose la question qui te brûle.";
        embedDesc = '';
    }

    else {
        embedAuthor = "Question : " + question;
        embedDesc = variables.eightBallAnswers[Math.floor(Math.random() * variables.eightBallAnswers.length)];
    }

    message.channel.send({ embeds: [{
        color: variables.SuHex,
        author: {name: embedAuthor},
        description: embedDesc
    }]})
}


export async function wiki(message, article) {
    let locale, wikiTitle, data;

    if (!article.length)
        return message.channel.send({ embeds : [{
                                    author: {name: "Vous avez oublié de préciser la langue !"},
                                    color: variables.SuHex
                                }]}
        );

    locale = article[0];
    if (locale == "listelangues")
        return message.channel.send({ embeds : [{
                                    title: "Liste des préfixes de langues disponibles :",
                                    description: "```" + variables.WikiLocales.join(' ') + "```",
                                    color: variables.SuHex
                                }]}
        );

    if (!variables.WikiLocales.includes(locale)) {
        message.channel.send({ embeds: [{
            title: ":grey_question: Langue incorrecte",
            description: "Pour obtenir la liste des langues, lancez la commande `unibot wiki listelangues` ou mieux, [cliquez ici](https://en.wikipedia.org/wiki/List_of_Wikipedias#Editions_overview).",
            color: variables.SuHex
        }]})
        help(message, "wiki");
        return;
    }

    wikiTitle = encodeURI(article.slice(1).join('_'));

    // Random article
    if (wikiTitle === '') {
        let pageId, embedAuthor, pageText;

        axios.get(`https://${locale}.wikipedia.org/w/api.php?action=query&generator=random&prop=extracts` +
                  `&grnlimit=1&grnnamespace=0&prop=extracts&explaintext=1&exintro=1&format=json`)
        
        .then( (response) => {
            data = response.data.query.pages;

            pageId = Object.keys(data)[0];

            embedAuthor = {name: data[pageId].title, iconURL: variables.WikiIcon};
            pageText = data[pageId].extract;

            if (pageText.length > 2000) {
                pageText = description.slice(1, 2000) + "...";
            }

            pageText += `\n\n[Ouvrir](https://${locale}.wikipedia.org/wiki/${data[pageId].title.replaceAll(' ', '_')})`;

            message.channel.send({ embeds: [{
                color: 0xFFFFFF,
                author: embedAuthor,
                description: pageText
            }]});
        })

        .catch(utils.errorHandler, message)
    }

    // Precise article
    else {
        axios.get(`https://${locale}.wikipedia.org/w/api.php?action=opensearch&limit=1&search=${wikiTitle}`)
        
        .then( (response) => {
            let results, links;

            [, results, , links] = response.data;


            if (results.length) {  // If matching articles are found, then use the first result
                let embedAuthor, pageId, pageText;

                axios.get(`https://${locale}.wikipedia.org/w/api.php?format=json&action=query&` +
                                `prop=extracts&exintro=1&explaintext=1&titles=${encodeURI(results[0].replaceAll(' ', '_'))}`)

                .then( (response) => {

                    data = response.data.query.pages;

                    pageId = Object.keys(data)[0];

                    pageText = data[pageId].extract;
                    if (pageText.length > 2000) {
                        pageText = pageText.slice(0, 2000) + "...";
                    }

                    pageText += `\n\n[Ouvrir](${links[0]})`;

                    embedAuthor = {name: data[pageId].title, iconURL: variables.WikiIcon};
                    message.channel.send({ embeds: [{
                        author: embedAuthor,
                        description: pageText,
                        color: 0xFFFFFF
                    }]})
                })

                .catch(errorHandler, message);
            }

            else {
                message.channel.send({ embeds: [{
                    author: {name: "Article introuvable"}
                }]})
            }
            })

        .catch(errorHandler, message);
    }
}


export async function couleur(message, color) {
    let role = message.member.roles.cache.get("872267637177069609");
    if (role == null) {
        return message.channel.send(`Tu n'as pas le rôle requis (<@&872267637177069609>)`);
    }


    if (color.length > 1 || color[0].length > 7 || color[0].length < 6) {
        return help(message, "couleur");
    }

    color = color[0];

    message.channel.send(`Oui tu as le rôle <@&${role.id}> et tu demandes la couleur ${color.toUpperCase()}`);
}


export function calcule(message, question) {
    if (question === []) return;



    waAPI.getFull(question.join(' '))
        .then( (result) => {
            let embed = new MessageEmbed();

            embed.setAuthor({
                    name: message.author.tag + " : " + result.inputstring,
                    iconURL: variables.WolframAlphaIcon,
                })
            
            if (result.pods[0].title === "Input") {
                embed.setTitle(result.pods[0].subpods[0].plaintext)
                embed.addField({
                    name: result.pods[0].title,
                })
            }
        })

        .catch(utils.errorHandler, message)
}



