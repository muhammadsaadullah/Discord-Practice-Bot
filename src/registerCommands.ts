import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { SlashCommandBuilder } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.TOKEN
const guildId = '1359627522161115257' // Practice Bot Community Server ID
const clientId = '1359620788650770532'

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
    new SlashCommandBuilder()
        .setName('starts')
        .setDescription(`Lesssgggggooooooo!`)
        .toJSON(),
    new SlashCommandBuilder()
        .setName('wallet')
        .setDescription("I Hope it isn't empty")
        .toJSON(),
    new SlashCommandBuilder()    
        .setName('daily')
        .setDescription('Dont Do it Daily!')
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
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: globalCommands }
        );

        // // Guild-specific commands (for fast testing)
        // await rest.put(
        //     Routes.applicationGuildCommands(clientId, guildId),
        //     { body: guildCommands }
        // );

        console.log('Successfully reloaded global and guild (testing) commands!');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
})();
