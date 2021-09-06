import { SuHex, eightBallAnswers, WikiIcon } from '../utils/variables.js';
import { request } from '../utils/utils.js';


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
        return;

    locale = article[0];
    wikiTitle = article.slice(1).join('_');

    // Random article
    if (wikiTitle === '') {
        let pageId, embedAuthor, pageText;

        data = request(`https://${locale}.wikipedia.org/w/api.php?action=query&generator=random&prop=extracts` +
                       `&grnlimit=1&grnnamespace=0&prop=extracts&explaintext=1&exintro=1&format=json`);
        if (data == null) return;

        data = data.query.pages

        pageId = Object.keys(data)[0];

        embedAuthor = {name: data[key].title, iconURL: WikiIcon};
        pageText = data[key].extract

        if (pageText.length > 2000) {
            pageText = description.slice(1, 2000) + "...";
        }

        pageText += `\n\n[Ouvrir](${data[key].title.replaceAll(' ', '_')})`

        message.channel.send({ embeds: [{
            color: 0xFFFFFF,
            author: embedAuthor,
            description: pageText
        }]});
    }

    // Precise article
    else {
        data = await request(`https://${locale}.wikipedia.org/w/api.php?action=opensearch&limit=1&search=${wikiTitle}`)
        if (data === null) return;

        [, , results, links] = data;


        if (results.length) {  // If matching articles are found, taking first result
            let embedAuthor, pageId, pageText;

            data = await request(`https://${locale}.wikipedia.org/w/api.php?format=json&action=query&` +
                            `prop=extracts&exintro=1&explaintext=1&titles=${results[0].replaceAll(' ', '_')}`);
            if (data === null) return;

            data = data.query.pages;

            embedAuthor = {name: data[key], iconURL: WikiIcon};

            pageId = Object.keys(data)[0];

            pageText = data[key].extract;
            if (pageText.length > 2000) {
                pageText = description.slice(1, 2000) + "...";
            }

            pageText += `\n\n[Ouvrir](${links[0]})`;

            message.channel.send({ embeds: [{
                author: embedAuthor,
                description: pageText
            }]})
        }

        else {
            message.channel.send({ embeds: [{
                author: {name: "Article introuvable"}
            }]})
        }
    }
}
