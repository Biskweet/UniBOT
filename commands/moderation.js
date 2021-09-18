import { SuHex } from '../utils/variables.js';

export function ping(message) {
    message.channel.send(
        {embeds: [{
           color: SuHex,
           title: `Pong ! :ping_pong: ${Date.now() - message.createdTimestamp} millisecondes.`}]
        })
}


export function sendInfo(message) {
    message.channel.send(
        {embeds: [{
            color: SuHex,
            description: "**channel:** " + message.channel +
                         "\n**server:** " + message.guild.name +
                         "\n**user:** " + message.author.tag
        }]})
}
