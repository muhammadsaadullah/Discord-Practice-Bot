import { ChatInputCommandInteraction } from "discord.js";

export async function handlePingCommand(interaction: ChatInputCommandInteraction) {
    try {
        await interaction.reply('Pong! My Schlong!!! 8====D')
    } catch (error) {
        console.error('Error handling wallet command:', error);
    }
}