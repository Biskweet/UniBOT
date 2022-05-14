const utils = require("../utils/utils.js");


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    let targetId = args[2];  // As always, skipping "unibot" and "unban"
    
    console.log(args, targetId)
    message.guild.members.unban(targetId)
        .then( (user) => message.react('✅'))
        .catch( (error) => utils.errorHandler({ message: `Could not unban user with ID ${targetId} (${error.message})` }, message));
}
