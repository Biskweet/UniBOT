const utils = require("../utils/utils.js");

module.exports = async (oldMessage, newMessage) => {
    if (newMessage.author.bot) return;  // Do not handle

    utils.filterMessage(newMessage);
}
