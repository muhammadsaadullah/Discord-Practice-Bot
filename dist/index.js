import { Client, EmbedBuilder, GatewayIntentBits, userMention } from 'discord.js';
import 'dotenv/config';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});
// !hey Command 
client.on('messageCreate', (message) => {
    if (message.content === "!hey" && !message.author.bot) {
        console.log(message.content);
        message.reply(`Hey ${userMention(message.author.id)}! Welcome to The Practise Bot :P`);
        console.log("Message sent successfully!");
    }
    if ((message.content == "Thanks" || message.content === "Thank You") && !message.author.bot) {
        message.react("❤️");
        message.reply("You're welcome!");
        return 0;
    }
});
// Rock Paper Scissors Game 
const gameState = new Map();
client.on('messageCreate', (message) => {
    if (message.author.bot)
        return;
    if (message.content === "!play") {
        message.reply(`Okay ${userMention(message.author.id)}, Lets Play Rock Paper Sciccors. Its the Only Game I have Currently :)`);
        message.channel.send(`Press One: Either R for Rock, P for Paper, OR S for Sciccors`);
        gameState.set(message.author.id, true);
        return;
    }
    if (gameState.get(message.author.id)) {
        if (message.content === "R") {
            message.reply("HAHA Nigger Yu LOST!!");
            gameState.set(message.author.id, false);
        }
        else if (message.content === "S") {
            message.reply("Thats What Gurls do. POOKIE");
            gameState.set(message.author.id, false);
        }
        else if (message.content === "P") {
            message.reply("WOW You WON Mother FUCKER");
            gameState.set(message.author.id, false);
        }
        else if (message.content != "S" && message.content != "R" && message.content != "P") {
            message.reply("HEY YU, Smart Alec... ENTER A VALID OPTION");
        }
    }
    // Anti-Mahad Code
    if (client.user) {
        if (message.author.id === '760908279454236712') {
            // Check if the bot is mentioned in the message
            if (message.mentions.has(client.user)) {
                message.reply(`I Will TOUCH Yu 2Knight, Ma Nigga..... KAKAROT U R GAE`);
            }
        }
    }
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const { commandName } = interaction;
    if (commandName === 'ping') {
        await interaction.reply('Pong! My Schlong!!! 8====D');
    }
    const startingMoni = 100000;
    const startingWorth = 50000;
    if (commandName === 'starts') {
        const embed = new EmbedBuilder()
            .setTitle(`Hey! Lets Start Your Journey. :P`)
            .setDescription('Start your journey. You wont know what you lost until its too late.')
            .setFields({ name: '\u000B', value: '\u000B' }, { name: "Starting Moni: Here You go kiddo. Use Wisely.", value: "" }, { name: "", value: `$ ${startingMoni}` }, { name: '\u000B', value: '\u000B' }, { name: "", value: `Yu Worth ALAT, but your worth is ${startingWorth}` })
            .setColor(0x5D4E8B)
            .setTimestamp()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed] });
    }
});
client.login(process.env.TOKEN);
