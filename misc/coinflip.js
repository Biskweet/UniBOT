module.exports = async (message, args) => {
    let side = ["Pile", "Face"][Math.floor(Math.random() * 2)];
    message.channel.send(`:coin: ${side} !`);
}