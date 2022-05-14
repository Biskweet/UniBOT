const variables = require('../utils/variables.js');
const utils = require('../utils/utils.js');


module.exports = async (member) => {
    client.channels.cache.get(variables.channels.leavingMembers).send(`${member.user.tag} a quitté le serveur.`);
    await utils.updateClientActivity();

    let memberLeaveLog = "\n------------ " + (new Date()).toJSON() + " -------------" +
                         `\n${member.user.tag} left the server.` +
                         "\n---------------------------------------------------\n";

    utils.saveLogs(memberLeaveLog);
}
