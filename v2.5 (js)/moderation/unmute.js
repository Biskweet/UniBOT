const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    let target = message.mentions.members.first();
    let mutedRole = message.guild.roles.cache.find( (role) => role.id == variables.roles.muted);

    if (target == undefined) utils.errorHandler({ message: "Could not find target." }, message);
    if (mutedRole == undefined) utils.errorHandler({ message: "No such role." }, message);

    target.roles.remove(mutedRole)
        .then( (memb) => message.react('✅'))
        .catch( (error) => utils.errorHandler(error, message));
}
