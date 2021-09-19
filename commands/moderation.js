import { SuHex } from '../utils/variables.js';
import * as utils from '../utils/utils.js'


export function destroyClient(message, client) {
    if (utils.isModo(message.member)) {

        message.channel.send(":smiling_face_with_tear: Au-revoir.")
        .then( (reply) => {
            console.log("Shutting down.");
            
            client.destroy();
        });
    }
}
