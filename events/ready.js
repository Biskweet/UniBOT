const utils = require("../utils/utils.js");


module.exports = async (client) => {
    console.log(client.user.tag, "is ready and running...");
    await utils.updateClientActivity();
    
    utils.checkSocialMedias();
    setInterval(utils.checkSocialMedias, 300000);
}
