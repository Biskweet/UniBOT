import { MessageEmbed } from 'discord.js';
import { help } from './help.js';
import axios from 'axios';
import WolframAlphaAPI from 'wolfram-alpha-api';
import * as variables from '../utils/variables.js';
import * as utils from '../utils/utils.js';


const waAPI = WolframAlphaAPI('AQLPTV-R88TU6G8PX');


export async function ping(message) {
    let embed = new MessageEmbed()
        .setTitle(`Pong ! :ping_pong: ${Date.now() - message.createdTimestamp} millisecondes.`)
        .setColor(variables.SuHex);

    message.channel.send({embeds: [embed]});
}


export async function sendInfo(message) {
    let embed = new MessageEmbed()
        .addColor(SuHex)
        .setDescription("**channel:** " + message.channel +
                        "\n**server:** " + message.guild.name +
                        "\n**user:** " + message.author.tag)

    message.channel.send({embeds: [embed]})
}


export async function eightBall(message, question) {
    let embedAuthor, embedDesc;

    question = question.join(" ");

    let embed = new MessageEmbed();

    if (question === '') {
        embed.setTitle("Pose la question qui te brûle.");
    }

    else {
        embed.setDescription(variables.eightBallAnswers[Math.floor(Math.random() * variables.eightBallAnswers.length)])
             .setAuthor({name: "Question : " + question,
                         iconURL: message.author.displayAvatarURL()});
    }

    message.channel.send({embeds: [embed]});
}


export async function wiki(message, article) {
    let locale, wikiTitle, data;

    let embed = new MessageEmbed();

    if (article.length === 0) {
        embed.setAuthor({name: "Vous avez oublié de préciser la langue !"})
        embed.setColor(variables.SuHex);
        return message.channel.send({embeds: [embed]});
    }

    locale = article[0];
    if (locale === "listelangues") {
        embed.setTitle("Liste des préfixes de langues disponibles :")
        embed.setDescription("```" + variables.WikiLocales.join(' ') + "```")
        embed.setColor(variables.SuHex);
        return message.channel.send({embeds: [embed]});
    }

    if (!variables.WikiLocales.includes(locale)) {
        locale = "fr";
        embed.setFooter({name: "En défaut de langue précisée, la langue par défaut est le français."});
        wikiTitle = encodeURI(article.slice(0).join('_'));
    }
    
    else {
        wikiTitle = encodeURI(article.slice(1).join('_'));
    }

    // Random article
    if (wikiTitle === '') {
        let pageId, pageText;

        axios.get(`https://${locale}.wikipedia.org/w/api.php?action=query&generator=random&prop=extracts` +
                  `&grnlimit=1&grnnamespace=0&prop=extracts&explaintext=1&exintro=1&format=json`)
        
            .then( (response) => {

                data = response.data.query.pages;
                pageId = Object.keys(data)[0];
                pageText = data[pageId].extract;

                if (pageText.length > 2000) {
                    pageText = description.slice(1, 2000) + "...";
                }

                pageText += `\n\n[Ouvrir](https://${locale}.wikipedia.org/wiki/${data[pageId].title.replaceAll(' ', '_')})`;

                embed.setDescription(pageText)
                     .setColor(16777215)
                     .setAuthor({name: data[pageId].title, iconURL: variables.WikiIcon})
            })

            .catch(utils.errorHandler, message);
    }

    // Precise article
    else {
        axios.get(`https://${locale}.wikipedia.org/w/api.php?action=opensearch&limit=1&search=${wikiTitle}`)
        
        .then( (response) => {
            let results, links;

            [, results, , links] = response.data;


            if (results.length !== 0) {  // If matching articles are found, then use the first result
                let pageId, pageText;

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

                        embed.setAuthor({name: data[pageId].title, iconURL: variables.WikiIcon})
                        embed.setDescription(pageText)
                        embed.setColor(16777215);
                    })

                    .catch(utils.errorHandler, message);
            }

            else {
                embed.setAuthor({name: "Article introuvable"});
            }
        })

        .catch(utils.errorHandler, message);
    }

    message.channel.send({embeds: [embed]});
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
            let embed = new MessageEmbed()
                .setTitle(question.join(' '))
                .setColor(variables.SuHex)
                .setImage()
                .setAuthor({
                    name: message.author.tag + " : " + result.inputstring,
                    iconURL: variables.WolframAlphaIcon,
                })
        })

        .catch(utils.errorHandler, message)
}
