module.exports = async (message, args) => {
    let target = args[0];
    let messageContent = args.slice(1).join(' ');

    client.users.fetch(target)
        .then( (user) => {
            return user.send(messageContent);
        }).catch( (error) => {
            errorHandler(error, message);
            message.reply("Error: " + error);
        });
}
