import { SuHex, eightBallAnswers, WikiIcon, WikiLocales } from '../utils/variables.js';
import { request } from '../utils/utils.js';
import axios from 'axios';


export function eightBall(message, question) {
    let embedAuthor, embedDesc;

    question = question.join(" ");

    if (question === '') {
        embedAuthor = "Pose la question qui te brûle.";
        embedDesc = '';
    }

    else {
        embedAuthor = "Question : " + question;
        embedDesc = eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)];
    }

    message.channel.send({ embeds: [{
        color: SuHex,
        author: {name: embedAuthor},
        description: embedDesc
    }]})
}


export async function wiki(message, article) {
    let locale, wikiTitle, data;

    if (!article.length)
        return message.channel.send({ embeds : [{
                                    description: "Vous avez oublié de préciser la langue !"
                                }]}
        );

    locale = article[0];
    if (!WikiLocales.includes(locale)) {
        return message.channel.send("") 
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

            embedAuthor = {name: data[pageId].title, iconURL: WikiIcon};
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

                    embedAuthor = {name: data[pageId].title, iconURL: WikiIcon};
                    message.channel.send({ embeds: [{
                        author: embedAuthor,
                        description: pageText,
                        color: 0xFFFFFF
                    }]})
                })
            }

            else {
                message.channel.send({ embeds: [{
                    author: {name: "Article introuvable"}
                }]})
            }
            });
    }
}






