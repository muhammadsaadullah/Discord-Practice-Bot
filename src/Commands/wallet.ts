import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { getDb } from "../database.js"; // Ensure this imports the DB correctly
import { WithId } from "mongodb";

interface userData {
  userId: string;
  balance: number;
  totalNetWorth: number;
  createdAt: Date;
}

export async function handleWalletCommand(interaction: ChatInputCommandInteraction) {
    try {
        const db = await getDb();
        if (!db) {
          return interaction.reply({content:"⚠️ Database not available. Please try again later.",  flags: MessageFlags.Ephemeral,});
        }
        const userDB = db.collection<userData>('users');
        const user = interaction.user; 

        // Try to find an existing wallet for the user
        let pUser = await userDB.findOne({ userId: user.id }) as WithId<userData>;
        
        const player = await userDB.find().toArray();


        if (!pUser) {
            return interaction.reply({
              content: "❌ Couldn't create or fetch your wallet. Please try again.",
               flags: MessageFlags.Ephemeral,
            });
        }

        // Step 2: Build a list of user net worths (for now, only balance)
        const rankedUsers = player.map(user => ({
            userId: user.userId,
            balance: user.balance || 0,
            totalNetWorth: user.balance || 0, // Later, add item worth here
            }));
    
            // Step 3: Sort users by net worth (descending)
            rankedUsers.sort((a, b) => b.totalNetWorth - a.totalNetWorth);
    
            // Step 4: Find this user's rank and data
            const rankIndex = rankedUsers.findIndex(u => u.userId === user.id);
            const userData = rankedUsers[rankIndex];
            const rankFormatted = `#${(rankIndex + 1).toLocaleString()}`;
            const totalUsers = rankedUsers.length.toLocaleString();
    

        

        // Create an embed to show the user's wallet balance
        // ‎ is a invisble character
        const embed = new EmbedBuilder()
            .setTitle(`${user.displayName || user.username}'s Wallet `)
            .setURL("https://www.youtube.com/watch?v=uHC3PIYbXCY")
            .setDescription(`**Cash:**‎  ‎ ⟐ ${pUser.balance} \n**Total Net:**‎ ‎ ⟐ ${pUser.totalNetWorth}`) 
            .setFooter({ text: `Global Rank: ${rankFormatted}` }) 
            .setColor(0x5D4E8B) // Purple color for the embed
       

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Error handling wallet command:', error);
        await interaction.reply('Something went wrong with your wallet command. Please try again later.');
    }
}
