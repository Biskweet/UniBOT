const utils = require("../utils/utils.js");


module.exports = async (client) => {
    console.log(client.user.tag, "is ready and running...");
    await utils.updateClientActivity();
    
    utils.checkSocialMedias();
    setInterval(utils.checkSocialMedias, 60 * 5 * 1000);    // Look for new posts on social m. every 5 min
    setInterval(utils.deleteOldLogs, 60 * 60 * 24 * 1000);  // Daily log delete
}
