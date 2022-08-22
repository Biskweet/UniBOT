module.exports = async (oldMessage, newMessage) => {
    if (message.author.bot) return;  // Do not handle

    utils.filterMessage(newMessage);
}
