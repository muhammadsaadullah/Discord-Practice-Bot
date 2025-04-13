import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getDb } from "../database.js"; // Ensure this imports the DB correctly
import { ObjectId, WithId } from "mongodb";

interface Wallet {
  userId: string;
  balance: number;
  createdAt: Date;
}

export async function handleWalletCommand(interaction: ChatInputCommandInteraction) {
    try {
        const db = await getDb();
        if (!db) {
          return interaction.reply("⚠️ Database not available. Please try again later.");
        }
        const wallets = db.collection<Wallet>('wallets');
        const user = interaction.user; 

        // Try to find an existing wallet for the user
        let userWallet = await wallets.findOne({ userId: user.id });

        // If no wallet is found, create a new one
        if (!userWallet) {
            const newWallet: Wallet = {
                userId: user.id,
                balance: 1000, 
                createdAt: new Date(),
            };

            // Insert the new wallet into the database and get the inserted document
            const result = await wallets.insertOne(newWallet);

            // Fetch the wallet again with _id
            userWallet = await wallets.findOne({ _id: result.insertedId });
            userWallet = userWallet as WithId<Wallet>;
        }

        // Create an embed to show the user's wallet balance
        const embed = new EmbedBuilder()
            .setTitle(`${user.displayName || user.username}'s Wallet `)
            .setDescription(` ✪ ${userWallet.balance} `)
            .setColor(0x5D4E8B) // Purple color for the embed

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error handling wallet command:', error);
        await interaction.reply('Something went wrong with your wallet command. Please try again later.');
    }
}
