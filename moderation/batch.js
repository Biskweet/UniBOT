module.exports = async (message, args) => {
    // Determining what command to be executed

    // unibot2 batch help ping wiki answer
    //    0  |   1  | 2  | 3  | 4  |  5


    let commandname = args[2];
    let command = client.commands.find( (comm) => comm.name == commandname);
    if (command == undefined) return utils.errorHandler({ message: `Could not find command ${command}.`}, message);

    args = args.slice(1);
    while (args.length > 2) {
        // Some functions can take more than 1 arguments, so to
        // avoid bugs we give only the 1st three each iteration.
        // Either way, for example `unibot batch ban 123 456 789`
        // would be executing:
        //     `unibot ban 123 456 789`
        //     `unibot ban 456 789`
        //     `unibot ban 789`
        // Which wouldn't work, hence the splice(0, 3).
        await command.execute(message, args.slice(0, 3));

        args = args.slice(1);
    }
}