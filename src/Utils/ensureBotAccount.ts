import { Client } from 'discord.js';
import { getDb } from '../database.js';

interface userData {
    userId: string;
    username: string;
    displayName: string;
    balance: number;
    totalNetWorth: number;
    dailyStreak: number;
    totalItemWorth: number;
    lastCheckIn: string;
    createdAt: Date;
}

// Function to extract the bot creation date from the Discord Snowflake ID
function getBotCreationDate(botUserId: string): Date {
    // Snowflake timestamp extraction
    const snowflake = BigInt(botUserId);
    const timestamp = (snowflake >> BigInt(22)) + BigInt(1420070400000); // Discord epoch
    return new Date(Number(timestamp)); // Convert to a JavaScript Date object
}

// Function to convert UTC time to Karachi Time (UTC+5)
function convertToKarachiTime(date: Date): Date {
    const karachiTime = new Date(date);
    karachiTime.setHours(karachiTime.getHours() + 5); // Add 5 hours for Karachi time (PKT)
    return karachiTime;
}

// Pass in client from your bot entry point
export async function ensureBotAccount(client: Client) {
    try {
        const botUser = client.user!;
        const botCreationDate = getBotCreationDate(botUser.id); // Get creation date of bot

        // Convert the creation date to Karachi Time
        const botCreationDateInKarachiTime = convertToKarachiTime(botCreationDate);
        const db = await getDb();
        if (!db) {
            console.log("⚠️ Database not available. Please try again later.");
            return;
        }

        const userDB = db.collection<userData>('users');

        const botId = botUser.id;
        let botAcc = await userDB.findOne({ userId: botId });

        if (!botAcc) {
            // If bot account doesn't exist, create a new one with the correct creation date in Karachi time
            await userDB.insertOne({
                userId: botId,
                username: botUser.username,
                displayName: botUser.displayName || botUser.username,
                balance: 1000000,
                totalNetWorth: 1000000,
                dailyStreak: 0,
                totalItemWorth: 0,
                lastCheckIn: 'never',
                createdAt: botCreationDateInKarachiTime // Save the bot's creation date in Karachi time
            });
        } else {
            const updates: Partial<userData> = {};
            // If bot account already exists, update the creation date if it's incorrect or missing
            if (!botAcc.createdAt || botAcc.createdAt.getTime() !== botCreationDateInKarachiTime.getTime()) updates.createdAt = botCreationDateInKarachiTime; // Update the creation date in Karachi time
            if (botAcc.balance === 0 || botAcc.balance === undefined || botAcc.balance === null ) updates.balance = 1000000;
            if (botAcc.totalNetWorth === undefined ) updates.totalNetWorth = botAcc.balance + (botAcc.totalItemWorth ?? 0);
                            

            if (Object.keys(updates).length > 0) {
                await userDB.updateOne({ userId: botId }, { $set: updates });

                // Re-fetch updated user
                botAcc = await userDB.findOne({ userId: botId });
            }
        }
    } catch (error) {
        console.error("❌ Failed to ensure bot wallet:", error);
    }
}
