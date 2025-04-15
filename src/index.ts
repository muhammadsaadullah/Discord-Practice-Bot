import { Client, GatewayIntentBits, MessageFlags } from 'discord.js';
import { ensureWalletExists } from './Utils/ensureWalletExists.js';
import { initializeDatabase } from './database.js';
import 'dotenv/config';

// Importing all commands via the barrel file
import { 
    handleHeyCommand, 
    handleRPSCommand, 
    handleMahadCommand, 
    handleWalletCommand, 
    handlePingCommand, 
    handleFakeWalletCommand 
} from './Commands/barrel.js';
import { handleDailyCommand } from './Commands/daily.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Database connection status flag
let isDatabaseReady = false;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    try {
        // Initialize the database before processing any commands
        await initializeDatabase();
        isDatabaseReady = true;
        console.log('Database is connected!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});

// Message event handler (Non-Slash Commands)
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        if (!isDatabaseReady) {
            return message.reply('Database is still initializing. Please wait...');
        }

        await handleHeyCommand(message);
        await handleMahadCommand(client, message);
        await handleRPSCommand(message);

    } catch (error) {
        console.error('Error processing message:', error);
        await message.reply('Oops! Something went wrong while processing your message.');
    }
});

// Slash Commands handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.isChatInputCommand()) return;

    if (!isDatabaseReady) {
        return interaction.reply({content:'Database is still initializing. Please wait...',  flags: MessageFlags.Ephemeral,});
    }

    const { commandName } = interaction;

    try {
        // Ensure the user has a wallet before processing commands that depend on it
        await ensureWalletExists(interaction);  // <-- Ensure wallet exists

        switch (commandName) {
            case 'ping':
                await handlePingCommand(interaction);
                break;
            case 'starts':
                await handleFakeWalletCommand(interaction);
                break;
            case 'wallet':
                await handleWalletCommand(interaction);
                break;
            case 'daily':
                await handleDailyCommand(interaction)
                break;
            default:
                console.warn(`Unhandled command: ${commandName}`);
                break;
        }
    } catch (error: any) {
        if (error.code === 10062) {
            console.warn('Interaction expired. Cannot reply.');
        } else {
            console.error('Error handling interaction:', error);
            await interaction.reply('Something went wrong while processing your command.');
        }
    }
});

// Log in with the bot token
client.login(process.env.TOKEN);
console.log("🔧 Loaded URI from .env");

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});
