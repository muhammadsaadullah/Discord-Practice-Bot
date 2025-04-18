import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.TOKEN;
const guildId = '1359627522161115257'; // Practice Bot Community Server ID
const clientId = '1359620788650770532';
if (!token) {
    console.error('Error: TOKEN environment variable is missing. Please ensure it is set in your .env file.');
    process.exit(1);
}
const rest = new REST({ version: '10' }).setToken(token);
// Global commands (will take ~1 hour to update)
const globalCommands = [
    {
        name: 'ping',
        description: 'Ping Pong Schlong!!',
    },
    // new SlashCommandBuilder()
    //     .setName('start')
    //     .setDescription(`Lesssgggggooooooo!`)
    //     .toJSON(),
    new SlashCommandBuilder()
        .setName('wallet')
        .setDescription("I Hope it isn't empty")
        .addUserOption(option => option.setName('user')
        .setDescription("Want to take a peak at someone else's moni, huh?")
        .setRequired(false) // This makes it optional
    )
        .toJSON(),
    new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Dont Do it Daily!')
        .toJSON(),
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Welp!...   Heeellll... *beep* *beep*')
        .toJSON()
];
// // Guild-specific commands (update instantly)
// const guildCommands = [
//     new SlashCommandBuilder()
//         .setName('test')
//         .setDescription("I Hope it isn't empty")
//         .toJSON(),
// ];
(async () => {
    try {
        console.log('Started refreshing application (/) commands...');
        // Global commands
        await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
        // // Guild-specific commands (for fast testing)
        // await rest.put(
        //     Routes.applicationGuildCommands(clientId, guildId),
        //     { body: guildCommands }
        // );
        console.log('Successfully reloaded global and guild (testing) commands!');
    }
    catch (error) {
        console.error('Failed to register commands:', error);
    }
})();
