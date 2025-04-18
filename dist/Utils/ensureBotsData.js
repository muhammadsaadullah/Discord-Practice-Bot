import { getDb } from '../database.js';
// Pass in client from your bot entry point
export async function ensureBotAccount(client) {
    try {
        const db = await getDb();
        if (!db) {
            console.log("⚠️ Database not available. Please try again later.");
            return;
        }
        const userDB = db.collection('users');
        const botUser = client.user;
        const botId = botUser.id;
        const botAccount = await userDB.findOne({ userId: botId });
        if (!botAccount) {
            await userDB.insertOne({
                userId: botId,
                username: botUser.username,
                displayName: botUser.displayName || botUser.username,
                balance: 0,
                totalNetWorth: 0,
                dailyStreak: 0,
                totalItemWorth: 0,
                lastCheckIn: 'never',
                createdAt: new Date()
            });
            console.log('✅ Bot wallet created!');
        }
        else {
            console.log('🟢 Bot wallet already exists.');
        }
    }
    catch (error) {
        console.error("❌ Failed to ensure bot wallet:", error);
    }
}
