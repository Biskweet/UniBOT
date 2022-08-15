const { MessageEmbed } = require("discord.js");
const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");
const axios = require("axios");


module.exports = async (message, args) => {
    var locale, wikiTitle, data, pageId, pageText;

    let embed = new MessageEmbed();

    args = args.slice(2)  // Removing prefix and command from the list of words
    if (args.length === 0) {
        args = ["fr"];
    }

    locale = args[0];
    if (locale === "listelangues") {
        embed.setTitle("Liste des préfixes de langues disponibles :")
             .setDescription('```' + variables.WikiLocales.join(' ') + '```')
             .setColor(variables.colors.SuHex);
        return message.channel.send({ embeds: [embed] });
    }

    if (variables.WikiLocales.includes(locale) === false) {
        embed.setFooter({ text: "Langue non précisée, par défaut en français." })
        locale = "fr";
        wikiTitle = encodeURI(args.slice(0).join('_'));
    } else {
        wikiTitle = encodeURI(args.slice(1).join('_'));
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
                pageText = description.slice(1, 2000) + '...';
            }

            pageText += `\n\n__[Ouvrir](https://${locale}.wikipedia.org/wiki/${data[pageId].title.replaceAll(' ', '_')})__`;

            embed.setDescription(pageText)
                 .setColor(16777215)
                 .setAuthor({ name: data[pageId].title, iconURL: variables.WikiIcon });

            message.channel.send({ embeds: [embed] });
        }


        // Specific article
        else {
            let response, results, links, _;

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
                    pageText = pageText.slice(0, 2000) + '...';
                }

                pageText += `\n\n__[Ouvrir](${links[0]})__`;

                embed.setAuthor({ name: data[pageId].title, iconURL: variables.WikiIcon })
                     .setDescription(pageText)
                     .setColor(16777215);

                message.channel.send({ embeds: [embed] });
            }

            else {
                embed.setAuthor({ name: "Article introuvable." })
                     .setColor(variables.colors.SuHex);
                message.channel.send({ embeds: [embed] });
            }
        }
    }

    catch (error) {
        utils.errorHandler(error, message);
    }
}
