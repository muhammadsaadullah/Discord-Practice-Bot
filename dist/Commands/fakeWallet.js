import { EmbedBuilder } from "discord.js";
export async function handleFakeWalletCommand(interaction) {
    try {
        const startingMoni = 100000;
        const startingWorth = 50000;
        // Starts Command
        const embed = new EmbedBuilder()
            .setTitle(`Hey! Lets Start Your Journey. :P`)
            .setDescription('Start your journey. You wont know what you lost until its too late.')
            .setFields({ name: '\u000B', value: '\u000B' }, { name: "Starting Moni: Here You go kiddo. Use Wisely.", value: "" }, { name: "", value: `$ ${startingMoni}` }, { name: '\u000B', value: '\u000B' }, { name: "", value: `Yu Worth ALAT, but your worth is ${startingWorth}` })
            .setColor(0x5D4E8B)
            .setTimestamp()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed] });
    }
    catch (error) {
        console.error('Error handling wallet command:', error);
    }
}
