import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { Client } from 'discord.js'
import dotenv from 'dotenv'


dotenv.config()

const token = process.env.TOKEN
const guildId = '1359627522161115257'
const clientId = '1359620788650770532'

const commands = [
{
    name: 'ping',
    description: 'Ping Pong Schlong!!',
},  
]

if (!token) {
    console.error('Error: TOKEN environment variable is missing. Please ensure it is set in your .env file.');
    process.exit(1); // Exit the process with an error code (1 means error)
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
    )
  
    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.log("Error!")
    console.error(error);
}
})()