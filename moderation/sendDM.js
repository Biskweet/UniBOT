const utils = require("../utils/utils.js");


module.exports = async (message, args) => {
    args = args.slice(2);

    if (args.length < 2) {
        message.reply("Nombre d'arguments incorrect (merci de préciser l'ID du destinataire __puis__ le message à envoyer.");
        message.react('❌');
        return;
    }

    let target = args[0];
    let messageContent = args.slice(1).join(' ');

    client.users.fetch(target)
        .then( (user) => {
            user.send(messageContent);
        }).then( (reply) => {
            message.react('✅')
        }).catch( (error) => {
            utils.errorHandler(error, message);
            message.reply("Error: " + error);
        });
}
