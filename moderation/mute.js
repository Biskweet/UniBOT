const variables = require("../utils/variables.js");
const utils = require("../utils/utils.js");


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    args = args.slice(2);
    let target = message.mentions.members.first();
    let mutedRole = message.guild.roles.cache.find( (role) => role.id == variables.roles.muted);

    if (target == undefined) return utils.errorHandler({ message: "Could not find target." }, message);
    if (mutedRole == undefined) return utils.errorHandler({ message: "No such role." }, message);

    target.roles.add(mutedRole).then( (member) => message.react('✅'));

    if (args.length > 0 && !isNaN(args[1])) {
        let duration = parseInt(args[1]) * 1000;

        if (duration > 500000000) {
            message.channel.send("Cannot mute for longer than 500'000 seconds (user was muted indefinitely).");
            return;  // Interrupt the function here so it does NOT trigger the timeout
        }

        setTimeout( () => {
            let unmute = client.commands.find(command => command.name == "unmute");
            unmute.execute(message).catch( (error) => utils.errorHandler(message, error));
        }, duration);
    }
}
