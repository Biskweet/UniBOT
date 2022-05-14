const variables = require('../utils/variables.js');
const utils = require('../utils/utils.js');


module.exports = async (oldMember, newMember) => {
    // Sensitive role monitor
    if (!utils.hasSensitiveRole(oldMember) && utils.hasSensitiveRole(newMember)) {
        client.channels.cache.get(variables.channels.moderation).send(`${newMember} a pris un rôle sensible. Merci de vérifier sa légitimité.`);
    }

    // Server access monitor
    if (!utils.hasNonSensitiveRole(oldMember) && utils.hasNonSensitiveRole(newMember)) {
        client.channels.cache.get(variables.channels.general1).send(`${newMember} a rejoint le serveur !`);
    }

    // New booster monitor (ADD the base VIP role automatically)
    if (oldMember.premiumSinceTimestamp < newMember.premiumSinceTimestamp) {
        let DSUGuild = client.guilds.cache.get(variables.DSUGuildId);
        if (DSUGuild == undefined) return;

        let vipRole = DSUGuild.roles.cache.get(variables.roles.vip);
        if (vipRole == undefined) return;

        newMember.roles.add(vipRole);
    }

    // Unboosting monitor (REMOVE all VIP roles)
    if (oldMember.premiumSinceTimestamp > newMember.premiumSinceTimestamp) {
        let DSUGuild = client.guilds.cache.get(variables.DSUGuildId);
        if (DSUGuild == undefined) return;

        newMember.roles.cache.forEach( (role) => {
            if (role.name.startsWith("VIP")) {
                newMember.roles.remove(role.id)
                    .catch( (error) => utils.errorHandler({ message: `Error while trying to remove role ${role.id} from ${newMember.user.tag} (${newMember.id})`}, null));
            }
        });
    }
}
