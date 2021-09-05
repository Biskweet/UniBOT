import DiscordJS from 'discord.js';
import { Intents, MessageEmbed } from 'discord.js';

let methods = {
          color: MessageEmbed.setColor,
          title: MessageEmbed.setTitle,
       titleUrl: MessageEmbed.setURL,
         author: MessageEmbed.setAuthor,
    description: MessageEmbed.setDescription,
         fields: MessageEmbed.addFields,
          field: MessageEmbed.addField,        // title: string, content: string, inline: boolean 
          image: MessageEmbed.setImage,
         footer: MessageEmbed.setFooter,
      timestamp: MessageEmbed.setTimestamp,
}

console.log(methods);
console.log(methods["color"]);
console.log(methods.color);
