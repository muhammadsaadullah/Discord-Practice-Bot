import { EmbedBuilder, MessageFlags } from "discord.js";
import { getDb } from "../database.js";
export async function handleDailyCommand(interaction) {
    try {
        const db = await getDb();
        if (!db) {
            return interaction.reply({ content: "⚠️ Database not available. Please try again later.", flags: MessageFlags.Ephemeral, });
        }
        const userDB = db.collection('users');
        const user = interaction.user;
        let pUser = await userDB.findOne({ userId: user.id });
        if (!pUser) {
            return interaction.reply({ content: "❌ User not found in database.", flags: MessageFlags.Ephemeral, });
        }
        // Helper functions
        const setCheckIn = async (userId) => {
            await userDB.updateOne({ userId }, { $set: { lastCheckIn: new Date().toISOString() } });
        };
        const canCheckIn = async (userId) => {
            const user = await userDB.findOne({ userId });
            if (!user.lastCheckIn)
                return true;
            const now = new Date();
            const last = new Date(user.lastCheckIn);
            const diff = now.getTime() - last.getTime();
            return diff >= 24 * 60 * 60 * 1000; // 24 hours in ms
        };
        const isEligible = await canCheckIn(user.id);
        if (!isEligible) {
            const now = new Date();
            const last = new Date(pUser.lastCheckIn);
            const next = new Date(last.getTime() + 24 * 60 * 60 * 1000);
            const msLeft = next.getTime() - now.getTime();
            const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
            const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
            return interaction.reply({
                content: `> ⏳ You already claimed your daily! \n> Come back in ${hoursLeft}h ${minsLeft}m.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        // Eligible for daily:
        const streak = pUser.dailyStreak + 1;
        const bonus = streak * 10000;
        const min = 100000;
        const max = 110000;
        const Moni = Math.floor(Math.random() * (max - min + 1)) + min + bonus;
        // Update DB
        await userDB.updateOne({ _id: pUser._id }, {
            $set: {
                dailyStreak: streak,
                balance: pUser.balance + Moni,
                totalNetWorth: pUser.balance + Moni,
                lastCheckIn: new Date().toISOString()
            }
        });
        const embed = new EmbedBuilder()
            .setTitle("**Daily Command!**")
            .setDescription(`Please Dont Do This Daily!! 🙏\n ‎ \n **You got** ‎ ⟐ ${Moni} `)
            .setFooter({ text: `Your Streak: ${streak}` });
        await interaction.reply({ embeds: [embed] });
    }
    catch (error) {
        console.error("⚠️ Error in /daily command:", error);
        await interaction.reply({ content: "Something went wrong, please try again later.", flags: MessageFlags.Ephemeral, });
    }
}
