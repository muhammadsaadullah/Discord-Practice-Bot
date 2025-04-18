import { Client, GatewayIntentBits, MessageFlags } from 'discord.js';
import { ensureWalletExists } from './Utils/ensureWalletExists.js';
import { ensureBotAccount } from './Utils/ensureBotAccount.js';
import { initializeDatabase } from './database.js';
import 'dotenv/config';
// Importing all commands via the barrel file
import { handleHeyCommand, handleRPSCommand, handleMahadCommand, handleWalletCommand, handlePingCommand, handleFakeWalletCommand, handleDailyCommand, handleMeowmurrrCommand, } from './Commands/barrel.js';
import { handleHelpCommand } from './Commands/help.js';
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
    await ensureBotAccount(client);
    try {
        // Initialize the database before processing any commands
        await initializeDatabase();
        isDatabaseReady = true;
        console.log('Database is connected!');
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
});
// Message event handler (Non-Slash Commands)
client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;
    try {
        // Remove for production, 0 sense to use it on messages 
        if (!isDatabaseReady) {
            const reply = await message.reply('Database is still initializing. Please wait...');
            // Delete message in 5 Sec
            setTimeout(() => {
                reply.delete().catch(() => { }); // avoid crashing if already deleted
            }, 5000);
            return;
        }
        await handleFakeWalletCommand(message);
        await handleHeyCommand(message);
        await handleMahadCommand(client, message);
        await handleRPSCommand(message);
        await handleMeowmurrrCommand(client, message);
        await handleHelpCommand({ message, client });
    }
    catch (error) {
        console.error('Error processing message:', error);
        const sentMessage = await message.reply('Oops! Something went wrong while processing your message.');
        // Delete message in 5 sec
        setTimeout(() => {
            sentMessage.delete().catch(console.error); // Catch error if already deleted
        }, 5000);
    }
});
// Slash Commands handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    if (!interaction.isChatInputCommand())
        return;
    if (!isDatabaseReady) {
        return interaction.reply({ content: 'Database is still initializing. Please wait...', flags: MessageFlags.Ephemeral });
    }
    const { commandName } = interaction;
    try {
        // Ensure the user has a wallet before processing commands that depend on it
        await ensureWalletExists(interaction); // <-- Ensure wallet exists
        switch (commandName) {
            case 'ping':
                await handlePingCommand(interaction);
                break;
            // case 'start':
            //     // await handleStartCommand(interaction);
            //     break;
            case 'wallet':
                await handleWalletCommand(interaction);
                break;
            case 'daily':
                await handleDailyCommand(interaction);
                break;
            case 'help':
                await handleHelpCommand({ interaction, client });
                break;
            default:
                console.warn(`Unhandled command: ${commandName}`);
                break;
        }
    }
    catch (error) {
        if (error.code === 10062) {
            console.warn('Interaction expired. Cannot reply.');
        }
        else {
            console.error('Error handling interaction:', error);
            await interaction.reply({ content: 'Something went wrong while processing your command.', flags: MessageFlags.Ephemeral });
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
