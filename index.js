const { Client, Intents, MessageAttachment } = require('discord.js');
require("dotenv").config();
const PREFIX = process.env.PREFIX;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]
});

const schedule1 = [0, 2, 5, 6, 8, 9, 12, 14, 17, 18, 21]


var merchants = [
    {
        name: 'malone',
        locations: 'https://imgur.com/a/vDhre76',
        schedules: schedule1,
        userIds: []
    },
    {
        name: 'burt',
        locations: 'https://imgur.com/a/yZtVsF6',
        schedules: schedule1,
        userIds: []
    },
    {
        name: 'oliver',
        locations: 'https://imgur.com/a/sbto2zs',
        schedules: schedule1,
        userIds: []
    },
    {
        name: 'nox',
        locations: 'https://imgur.com/a/Rw3uyLr',
        schedules: schedule1,
        userIds: []
    },
    {
        name: 'aricer',
        locations: 'https://imgur.com/a/Ih4SlUV',
        schedules: schedule1,
        userIds: []
    },
    {
        name: 'rayni',
        locations: 'https://imgur.com/a/3PLnN8g',
        schedules: schedule1,
        userIds: []
    }
]

function sub(userId, merchantName) {
    const isMerchant = (element) => element.name == merchantName;
    const isId = (element) => element == userId;

    const merchantindex = merchants.findIndex(isMerchant);
    const currentUserIds = merchants.find(isMerchant).userIds;
    const userIndex = currentUserIds.findIndex(isId);

    if (currentUserIds.includes(userId)) {
        merchants[merchantindex].userIds.splice(userIndex, 1)
        return false;
    } else {
        merchants[merchantindex].userIds.push(userId);
        return true;
    }
}

function check() {
    const d = new Date(new Date().toLocaleString("en-IE", { timeZone: process.env.TIME_ZONE }));
    const hour = d.getHours();
    const mins = d.getMinutes();
    if (mins == 25) {
        const nextMerchants = merchants.filter(m => m.schedules.includes(hour));
        nextMerchants.forEach(m => {
            const usersToNotify = m.userIds;
            usersToNotify.forEach(userId => {
                client.users.fetch(userId).then((user) => {
                    try {
                        user.send('**' + m.name + '** va apparaître dans 5 minutes !\n' + m.locations);
                    } catch (err) {
                        console.log("err")
                    }
                })
            })
        });
    }
}

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{
            name: 'Surveiller les marchants'
        }],
        status: 'dnd'
    })
});

client.on('messageCreate', async message => {
    if (message.content.startsWith(PREFIX)) {
        const input = message.content.slice(PREFIX.length).trim().split(" ");
        const command = input.shift()

        switch (command) {
            case 'aide':
            case 'help':
                message.channel.send('Entrer le nom du marchant pour recevoir ses notifications (' + PREFIX + '<nom du marchant>).\nListe des commandes/marchants disponibles :\n!lucas\n!morris\n!mac\n!jeffrey\n!dorella\n!malone\n!burt\n!oliver\n!nox\n!aricer\n!rayni\n!ben\n!peter\n!laitir\nAutre commandes :\n!guide');
                break;
            case 'guide':
                message.reply('https://lost-ark.maxroll.gg/resources/wandering-merchant-guide');
                break;
            case 'malone':
            case 'burt':
            case 'oliver':
            case 'nox':
            case 'aricer':
            case 'rayni':
                const subscribed = sub(message.author.id, command);
                const merchantNameBold = '**' + command + '**';
                const answer = subscribed ? ' s\'est abonné au marchant ' + merchantNameBold : ' s\'est désabonné du marchant ' + merchantNameBold;
                message.reply(message.author.username + answer);
                break;
            default:
                message.reply('Commande inconue');
                break;
        }
    }
});

setInterval(check, 60000);

client.login(process.env.BOT_TOKEN);