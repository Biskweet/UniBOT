import { MessageEmbed } from 'discord.js';
import WolframAlphaAPI from 'wolfram-alpha-api';
import dotenv from 'dotenv';
import axios from 'axios';
import * as variables from '../utils/variables.js';
import * as utils from '../utils/utils.js';
import { help } from './help.js';


dotenv.config()


const waAPI = WolframAlphaAPI(process.env.WOLFRAMALPHA_TOKEN);


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

    let embed = new MessageEmbed()
        .setColor(variables.SuHex);

    if (question === '') {
        embed.setTitle("Pose la question qui te brûle.");
    }

    else {
        embed.setAuthor("Question : " + question, message.author.displayAvatarURL(), message.url);
             .setDescription(variables.eightBallAnswers[Math.floor(Math.random() * variables.eightBallAnswers.length)])
    }

    message.channel.send({embeds: [embed]});
}


export async function wiki(message, article) {
    var locale, wikiTitle, data, pageId, pageText;

    let embed = new MessageEmbed();

    if (article.length === 0) {
        article = ["fr"];
    }

    locale = article[0];
    if (locale === "listelangues") {
        embed.setTitle("Liste des préfixes de langues disponibles :")
             .setDescription("```" + variables.WikiLocales.join(' ') + "```")
             .setColor(variables.SuHex);
        return message.channel.send({embeds: [embed]});
    }   

    if (!variables.WikiLocales.includes(locale)) {
        embed.setFooter("Langue non précisée, par défaut en français.")
        locale = "fr";
        wikiTitle = encodeURI(article.slice(0).join('_'));
    }
    
    else {
        wikiTitle = encodeURI(article.slice(1).join('_'));
    }

    try {
        // Random article
        if (wikiTitle === '') {

            let response = await axios.get(`https://${locale}.wikipedia.org/w/api.php?action=query&generator=random&prop=extracts` +
                                           `&grnlimit=1&grnnamespace=0&prop=extracts&explaintext=1&exintro=1&format=json`);
            
            data = response.data.query.pages;
            pageId = Object.keys(data)[0];
            pageText = data[pageId].extract;

            if (pageText.length > 2000) {
                pageText = description.slice(1, 2000) + "...";
            }

            pageText += `\n\n__[Ouvrir](https://${locale}.wikipedia.org/wiki/${data[pageId].title.replaceAll(' ', '_')})__`;

            embed.setDescription(pageText)
                 .setColor(16777215)
                 .setAuthor(data[pageId].title, variables.WikiIcon);

            message.channel.send({embeds: [embed]});
        }

        // Precise article
        else {
            let response, results, links;

            response = await axios.get(`https://${locale}.wikipedia.org/w/api.php?action=opensearch&limit=1&search=${wikiTitle}`);
            [_, results, _, links] = response.data;

            if (results.length !== 0) {  // If matching articles are found, then use the first result
                let pageId, pageText;

                response = await axios.get(`https://${locale}.wikipedia.org/w/api.php?format=json&action=query&` +
                          `prop=extracts&exintro=1&explaintext=1&titles=${encodeURI(results[0].replaceAll(' ', '_'))}`)


                data = response.data.query.pages;
                pageId = Object.keys(data)[0];
                pageText = data[pageId].extract;

                if (pageText.length > 2000) {
                    pageText = pageText.slice(0, 2000) + "...";
                }

                pageText += `\n\n__[Ouvrir](${links[0]})__`;

                embed.setAuthor(data[pageId].title, variables.WikiIcon)
                     .setDescription(pageText)
                     .setColor(16777215);

                message.channel.send({ embeds: [embed]});
            }

            else {
                embed.setAuthor("Article introuvable.")
                     .setColor(variables.SuHex);
                message.channel.send({ embeds: [embed]});
            }
        }
    }

    catch (error) {
        utils.errorHandler(error, message);
    }
}


export async function answer(message, question) {
    let embed = new MessageEmbed().setColor(variables.SuHex);   

    if (question.length === 0) {
        message.react('❌');
        embed.setTitle("Aucune question posée.");
        return message.channel.send({embeds: [embed]});
    }

    waAPI.getShort(question.join(' ').replaceAll('?', ''))
        .then( (result) => {
            let embed = new MessageEmbed()
                .setColor(16345394)
                .setAuthor(utils.capitalize(question.join(' ')), message.author.displayAvatarURL())
                .setDescription(result)
                .setFooter("Powered by WolframAlpha", variables.WolframAlphaIcon)

            message.channel.send({embeds: [embed]});
        })

        .catch( (error) => {
            message.react('❌');

            if (error.message === "Wolfram|Alpha did not understand your input") {
                message.react('❌');
                embed.setTitle("Wolfram Alpha did not understand your input.")
                     .setFooter("😕 Maybe it can't answer that.");
            }
            
            else {
                embed.setTitle(error.message.replaceAll("|", "") + ".");
            }
            
            message.channel.send({embeds: [embed]});
        });
}
