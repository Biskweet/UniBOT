module.exports = {

    colors: {
        SuHex: 0x192165,
        Red: 16711680,
        Green: 65280
    },

    WikiIcon: "https://wikipedia.org/static/apple-touch/wikipedia.png",

    WolframAlphaIcon: "https://icon-library.com/images/wolfram-alpha-icon/wolfram-alpha-icon-17.jpg",

    twitterAccounts: ["SU", "SULettres", "SUMédecine", "SUPolytech"],

    prefix: "UNIBOT ",

    roles: {
        vip: "924020284367978516",
        moderator: "749971084228558969",
        booster: "852891262659067924",
        student: "779741939447627798",
        visitor: "862047877375328256",
        certif: "755466223482961963",
        alumni: "862048136414363699",
        universityAdmin: "777533078763208724",
        teacherResearcher: "754463571345276969",
        muted: "850707162561118229",
        unibot: "869605212078350347"
    },

    channels: {
        deletedMsgs: "776802470089064510",
        logs: "961771798075158578",
        moderation: "749982348187271299",   
        twitter: "777304594195677225",
        youtube: "749770030954053632",
        newMembers: "752891071553601638",
        leavingMembers: "777521246950129674",
        startHere: "859573235015614485",
        general1: "776599592980185119",
        sharedServers: "754653542178095195"
    },

    DSUGuildId: "749364640147832863",

    unibotId: "485490695604273153",

    months: ["janvier","février", "mars",
             "avril", "mai", "juin",
             "juillet", "août", "septembre",
             "octobre", "novembre", "décembre"],


    eightBallAnswers: ["C'est certain.", 
                       "Décidément, oui.",
                       "Sans l'ombre d'un doute.",
                       "Oui, certainement.",
                       "Compte là-dessus.",
                       "Oui, tel que je le vois.",
                       "Probablement.",
                       "C'est bien parti pour.",
                       "Ouep.",
                       "Réponse incertaine, réessaie plus tard.",
                       "Ahahah oh la question nulle",
                       "Ne compte pas dessus.",
                       "Les cartes de tarot me disent que non.",
                       "La réponse est non.",
                       "Selon mes sources ~~oui~~ ah non en fait.",
                       "Il y a peu de chances.",
                       "J'en doute.",
                       "C'est non.",
                       "Négatif.",
                       "N'y pense même pas."],

    WikiLocales: ['en', 'fr', 'de', 'es', 'ja', 'ru', 'it', 'zh', 'pt', 'ar', 'fa', 'pl', 'nl', 'id', 'uk', 'he', 'sv',
                  'cs', 'ko', 'vi', 'ca', 'no', 'fi', 'hu', 'tr', 'th', 'hi', 'bn', 'simple', 'ceb', 'ro', 'sw', 'kk',
                  'da', 'eo', 'sr', 'lt', 'sk', 'bg', 'sl', 'eu', 'et', 'hr', 'ms', 'el', 'arz', 'ur', 'ta', 'te', 'nn',
                  'gl', 'az', 'af', 'bs', 'be', 'ml', 'ka', 'is', 'sq', 'uz', 'la', 'br', 'mk', 'lv', 'azb', 'mr', 'sh', 'tl',
                  'cy', 'ckb', 'ast', 'be-tarask', 'zh-tue', 'hy', 'pa', 'as', 'my', 'kn', 'ne', 'si', 'tt', 'ha', 'war',
                  'zh-min-nan', 'vo', 'min', 'lmo', 'ht', 'lb', 'gu', 'tg', 'sco', 'ku', 'new', 'bpy', 'nds', 'io', 'pms',
                  'su', 'oc', 'jv', 'nap', 'ba', 'scn', 'wa', 'bar', 'an', 'ksh', 'szl', 'fy', 'frr', 'als', 'ia', 'ga', 'yi', 
                  'mg', 'gd', 'vec', 'ce', 'sa', 'mai', 'xmf', 'sd', 'wuu', 'mrj', 'mhr', 'km', 'roa-tara', 'am', 'roa-rup',
                  'map-bms', 'bh', 'mnw', 'shn', 'bcl', 'co', 'cv', 'dv', 'nds-nl', 'fo', 'hif', 'fur', 'gan', 'glk', 'hak',
                  'ilo', 'pam', 'csb', 'avk', 'lij', 'li', 'gv', 'mi', 'mt', 'nah', 'nrm', 'se', 'nov', 'qu', 'os', 'pi', 'pag',
                  'ps', 'pdc', 'rm', 'bat-smg', 'sc', 'to', 'tk', 'hsb', 'fiu-vro', 'vls', 'yo', 'diq', 'zh-classical', 'frp',
                  'lad', 'kw', 'mn', 'haw', 'ang', 'ln', 'ie', 'wo', 'tpi', 'ty', 'crh', 'nv', 'jbo', 'ay', 'pcd', 'zea', 'eml',
                  'ky', 'ig', 'or', 'cbk-zam', 'kg', 'arc', 'rmy', 'ab', 'gn', 'so', 'kab', 'ug', 'stq', 'udm', 'ext', 'mzn',
                  'pap', 'cu', 'sah', 'tet', 'sn', 'lo', 'pnb', 'iu', 'na', 'got', 'bo', 'dsb', 'chr', 'cdo', 'om', 'sm', 'ee',
                  'ti', 'av', 'bm', 'zu', 'pnt', 'cr', 'pih', 'ss', 've', 'bi', 'rw', 'ch', 'xh', 'kl', 'ik', 'bug', 'dz', 'ts',
                  'tn', 'kv', 'tum', 'xal', 'st', 'tw', 'bxr', 'ak', 'ny', 'fj', 'za', 'ks', 'ff', 'lg', 'sg', 'rn', 'chy', 'nwl',
                  'lez', 'bjn', 'gom', 'tyv', 'vep', 'nso', 'kbd', 'rue', 'pfl', 'koi', 'krc', 'ace', 'olo', 'kaa', 'mdf', 'myv',
                  'ady', 'jam', 'tcy', 'dty', 'atj', 'kbp', 'din', 'lfn', 'gor', 'inh', 'sat', 'hyw', 'ban', 'szy', 'awa', 'ary',
                  'lld', 'smn', 'skr', 'mad', 'dag', 'shi', 'lbe', 'ki', 'ltg', 'srn', 'nqo', 'gcr'],

    commandFiles: [
        // miscellaneous
        './misc/8ball.js',
        './misc/answer.js',
        './misc/coinflip.js',
        './misc/couleur.js',
        './misc/help.js',
        './misc/ping.js',
        './misc/pong.js',
        './misc/wiki.js',

        // moderation
        './moderation/ban.js',
        './moderation/batch.js',
        './moderation/clear.js',
        './moderation/destroy.js',
        './moderation/kick.js',
        './moderation/mute.js',
        './moderation/printcache.js',
        './moderation/unban.js',
        './moderation/unmute.js',

        // utils
        // './utils/utils.js'
    ],

    eventFiles: [
        './events/guildBanAdd.js',
        './events/guildBanRemove.js',
        './events/guildMemberAdd.js',
        './events/guildMemberRemove.js',
        './events/guildMemberUpdate.js',
        './events/messageCreate.js',
        './events/messageDelete.js',
        './events/ready.js'
    ]

}
