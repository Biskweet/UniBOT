import { SuHex, eightBallAnswers } from '../utils/variables.js';

export function eightBall(message, question) {
    let embed_author, embed_desc;

    question = question.join(" ");

    if (question === '') {
        embed_author = "Pose la question qui te brûle.";
        embed_desc = ""
    }

    else {
        embed_author = "Question : " + question;
        embed_desc = eightBallAnswers[Math.floor(Math.random() * eightBallAnswers.length)];
    }

    message.channel.send({ embeds: [{
        color: SuHex,
        author: {name: embed_author},
        description: embed_desc
    }]})
}
