import { getDb } from "../database.js";
export async function logGuildsDaily(client) {
    const db = await getDb();
    const guildCollection = db.collection("guild_status");
    const currentGuilds = await Promise.all(client.guilds.cache.map(async (g) => {
        const guild = await g.fetch(); // fetch full guild data
        return {
            guildId: g.id,
            name: g.name,
            joinedAt: guild.members.me?.joinedAt ?? new Date() // fallback just in case
        };
    }));
    const currentGuildIds = new Set(currentGuilds.map(g => g.guildId));
    // 1. Update current guilds
    for (const guild of currentGuilds) {
        await guildCollection.updateOne({ guildId: guild.guildId }, {
            $set: {
                name: guild.name,
                lastSeen: new Date(),
                status: "active"
            },
            $setOnInsert: {
                joinedAt: guild.joinedAt
            }
        }, { upsert: true });
    }
    // 2. Mark any removed guilds
    await guildCollection.updateMany({ guildId: { $nin: [...currentGuildIds] } }, { $set: { status: "removed" } });
    console.log("✅ Guild status updated.");
}
