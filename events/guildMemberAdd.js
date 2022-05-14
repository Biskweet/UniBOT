const variables = require('../utils/variables.js');
const utils = require('../utils/utils.js');


module.exports = async (member) => {
    client.channels.cache.get(variables.channels.newMembers).send(`${member} a rejoint le serveur.`);
    await utils.updateClientActivity();

    let memberJoinMsg = "\n------------ " + (new Date()).toJSON() + " -------------" +
                        `\n${member.user.tag} joined the server.` +
                        "\n---------------------------------------------------\n";

    utils.saveLogs(memberJoinMsg);

    client.channels.cache.get(variables.channels.startHere).send(`${member} choisissez pour accéder au serveur !`)
        .then( (pingMessage) => {
            setTimeout(() => {
                pingMessage.delete();
            }, 500);
        });
}
