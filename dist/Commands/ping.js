export async function handlePingCommand(interaction) {
    try {
        await interaction.reply('Pong! My Schlong!!! 8====D');
    }
    catch (error) {
        console.error('Error handling wallet command:', error);
    }
}
