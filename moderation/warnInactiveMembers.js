const { MessageEmbed } = require("discord.js");
const variables = require("../utils/variables.js")
const utils = require("../utils/utils.js");
const fs = require("fs");


module.exports = async (message, args) => {
    if (!utils.isModo(message.member)) {
        return;  // Not a moderator
    }

    let serv = message.guild;

    serv.members.fetch().then( async () => {
        let members = serv.members.cache;
        let success = 0, fail = 0, total = 0;
        let successList = [];

        await Promise.allSettled(members.map( async (member) => {
            if (member.roles.cache.size != 1) return;

            total++;

            let embed = new MessageEmbed();
            embed.setTitle("👋 Bonjour !")
                 .setThumbnail("https://i.ibb.co/b6fjMNs/new-logo.png")
                 .setDescription("Si vous recevez ce message, c'est que vous n'avez pas pris de rôle sur le Discord Étudiant Sorbonne Université. " +
                                 "\nPar conséquent, vous n'avez accès à presque aucun salon, y compris les tchats généraux et ceux qui concernent vos disciplines d'étude." +
                                 "\nCela vaut aussi bien pour les étudiants, les visiteurs les professeurs, les chercheurs et les membres de l'administration de Sorbonne Université.\n" +
                                 "\n__Nous vous encourageons fortement à faire le premier pas et à choisir le rôle qui correspond à votre profil.__" +
                                 "\n\nVoilà le lien d'accès rapide :" +
                                 "\n👉 https://discord.gg/sorbonne\n" +
                                 "\nEn espérant vous voir actif sur le serveur ! 🎉")
                 .setFooter({ text: "✅ L'équipe de DSU" })
                 .setColor(variables.colors.SuHex);


            return member.send({ embeds: [embed] })
                .then( (msg) => member.send("https://discord.gg/sorbonne"))
                .then( (link) => {
                    success++;
                    successList.push(member.user.tag);
                })
                .catch( (error) => {
                    fail++;
                    console.error(`Failed to send message to ${member.user.tag} (${err})`);
                });
        }));

        console.log(`Results: successful msgs: ${success}/${total}, failed: ${fail}/${total}`);

        fs.appendFile("success.txt", successList.toString(), (error) => {
            if (error) {
                console.log(`Error while saving results (${error})`);
            }
        });
    });
}