const utils = require("../utils/utils.js");


module.exports = async (message) => {
    if (message.author.bot) return;  // Do not handle

    // Logging private messages
    if (message.channel.type == "DM") {
        return utils.logDirectMessages(message);
    }

    // Handling commands
    if (utils.isCommand(message)) {
        // Separating the message into words and removing the empty ones (ex: 'a  b'.split(' ') -> ['a', '', ''] -> ['a'])
        const words = message.content.split(' ').filter( (word) => word != '');
        const commandname = words[1];

        const command = client.commands.find( (command) => command.name == commandname);
        if (command == undefined) return;

        // Executing command
        command.execute(message, words);
    }

    // Filtering message
    utils.filterMessage(message);
}
