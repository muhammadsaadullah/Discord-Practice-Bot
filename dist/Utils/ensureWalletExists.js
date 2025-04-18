import { getDb } from '../database.js';
import { MessageFlags } from 'discord.js';
export async function ensureWalletExists(interaction) {
    try {
        const db = await getDb();
        if (!db) {
            await interaction.reply({
                content: "⚠️ Database not available. Please try again later.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        const userDB = db.collection('users');
        const user = interaction.user;
        let pUser = await userDB.findOne({ userId: user.id });
        if (!pUser) {
            const newUser = {
                userId: user.id,
                username: user.username,
                displayName: user.displayName,
                balance: 1000,
                totalNetWorth: 1000,
                dailyStreak: 0,
                totalItemWorth: 0,
                lastCheckIn: "undefined",
                createdAt: new Date(),
            };
            const result = await userDB.insertOne(newUser);
            pUser = await userDB.findOne({ _id: result.insertedId });
        }
        else {
            const updates = {};
            if (pUser.username !== user.username)
                updates.username = user.username;
            if (pUser.displayName !== user.displayName)
                updates.displayName = user.displayName;
            if (pUser.totalItemWorth === undefined)
                updates.totalItemWorth = 0;
            if (pUser.totalNetWorth === undefined)
                updates.totalNetWorth = pUser.balance + (pUser.totalItemWorth ?? 0);
            if (pUser.dailyStreak === undefined)
                updates.dailyStreak = 0;
            let TNWorth = pUser.balance + (pUser.totalItemWorth ?? 0);
            if (pUser.totalNetWorth !== TNWorth)
                updates.totalNetWorth = TNWorth;
            if (Object.keys(updates).length > 0) {
                await userDB.updateOne({ _id: pUser._id }, { $set: updates });
                // Re-fetch updated user
                pUser = await userDB.findOne({ _id: pUser._id });
            }
        }
        return pUser;
    }
    catch (error) {
        console.error('❌ Error in ensureWalletExists:', error);
    }
}
