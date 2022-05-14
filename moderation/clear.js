const utils = require("../utils/utils.js");


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    args = args.slice(2);

    if (args.length != 1 || isNaN(args[0])) {
        return message.react('❌');  // Incorrect input
    }

    let amount = parseInt(args[0]);

    if (amount > 150) {
        message.react('❌');
        message.channel.send("Impossible de supprimer plus de 150 messages à la fois.")
            .then( (errorMessage) => {
                setTimeout( () => {
                    errorMessage.delete();
                }, 7500);
            });
        return;
    }

    message.channel.messages.fetch({ limit: (amount + 1) })
        .then( (messages) => message.channel.bulkDelete(messages))
        .catch( (error) => {
            utils.errorHandler(error, message);
            message.channel.send(`Erreur lors de la suppression de masse (${error.message})`);
        });
}
