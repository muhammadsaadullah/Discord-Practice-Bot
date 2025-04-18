import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { getDb } from "../database.js";
import { WithId } from "mongodb";
import { fMoni } from "../Utils/formatters.js";


// Configurable Constants (Change from here)
const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;   // ⚠️ Testing: (5 * 1000) = 5 seconds | (Prod: 24 * 60 * 60 * 1000)
const STREAK_BONUS_PER_DAY = 10000;              // Bonus per streak level
const MONI_MIN = 100000;                         // Base min Moni
const MONI_MAX = 110000;                         // Base max Moni


interface userData {
    userId: string;
    balance: number;
    totalNetWorth: number;
    createdAt: Date;
    lastCheckIn: string;
    dailyStreak: number;
}

export async function handleDailyCommand(interaction: ChatInputCommandInteraction) {
    try {
        const db = await getDb();
        if (!db) {
            return interaction.reply({
                content: "⚠️ Database not available. Please try again later.",
                flags: MessageFlags.Ephemeral,
            });
        }

        const userDB = db.collection<userData>('users');
        const user = interaction.user;

        const pUser = await userDB.findOne({ userId: user.id }) as WithId<userData>;

        if (!pUser) {
            return interaction.reply({
                content: "❌ User not found in database.",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Check Eligibility Logic
        const checkIfEligible = async (userId: string) => {
            const userData = await userDB.findOne({ userId }) as WithId<userData>;

            if (!userData.lastCheckIn) {
                return { eligible: true, diff: 0 };
            }

            const now = new Date();
            const lastCheckIn = new Date(userData.lastCheckIn);
            const diff = now.getTime() - lastCheckIn.getTime();
            const eligible = diff >= DAILY_COOLDOWN_MS;
            return { eligible, diff };
        };

        const { eligible, diff } = await checkIfEligible(user.id);
        let streak = pUser.dailyStreak ?? 0; // Handle undefined streaks

        if (!eligible) {
            const now = new Date();
            const last = new Date(pUser.lastCheckIn);
            const next = new Date(last.getTime() + DAILY_COOLDOWN_MS);
            const msLeft = next.getTime() - now.getTime();
            const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
            const minsLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));

            return interaction.reply({
                content: `> ⏳ You already claimed your daily! \n> Come back in ${hoursLeft}h ${minsLeft}m.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        // Streak Management Logic
        const manageStreak = async (diff: number) => {
            const Day1 = 24 * 60 * 60 * 1000 // 1 Day = 24hr in ms
            const Day2 = Day1 * 2
            const Day3 = Day1 * 3
            const Day4 = Day1 * 4
            const Day5 = Day1 * 5
            const Day6 = Day1 * 6

            if (diff > Day6 && streak != 0) {                          // Finish the Streak if forgot doing daily for 6 or more than 6 days
                streak = 0
            } else if (diff > Day5 && diff <= Day6 && streak != 0) {   // Half the Streak if forgot to do daily for 5 days
                streak = 0.5 * streak
            } else if (diff > Day4 && diff <= Day5 && streak != 0) {   // Reduce the Streak by 1/4th if forgot to do daily for 4 days
                streak = 0.25 * streak
            } else if (diff > Day3 && diff <= Day4 && streak != 0) {   // Reduce the Streak by 3 if forgot to do daily for 3 Days
                streak = streak - 3
            } else if (diff > Day2 && diff <= Day3 && streak != 0) {   // Reduce the Streak by 2 if forgot to do daily for 2 Days
                streak = streak - 2
            } else if (diff > Day1 && diff <= Day2 && streak != 0) {   // Reduce the Streak by 1 if forgot to do daily for 1 Day
                streak = --streak
            }

            streak = Math.max(0, Math.floor(streak));
            return streak;
        }

        /*
        // manageStreak Logic (Testing - 1 Day = 10 sec)
        const manageStreak = async (diff: number) => {
            const Day1 = 10 * 1000; // 1 Day = 10 seconds
            const Day2 = Day1 * 2; const Day3 = Day1 * 3; const Day4 = Day1 * 4; const Day5 = Day1 * 5; const Day6 = Day1 * 6;
            if (diff > Day6 && streak != 0) { streak = 0;
            } else if (diff > Day5 && diff <= Day6 && streak != 0) { streak = 0.5 * streak;
            } else if (diff > Day4 && diff <= Day5 && streak != 0) { streak = 0.25 * streak;
            } else if (diff > Day3 && diff <= Day4 && streak != 0) { streak = streak - 3;
            } else if (diff > Day2 && diff <= Day3 && streak != 0) { streak = streak - 2;
            } else if (diff > Day1 && diff <= Day2 && streak != 0) { streak = --streak;}
            streak = Math.max(0, Math.floor(streak)); 
            return streak;
        }
        */

       
        // New users or first-time daily
        if (!pUser.lastCheckIn) {
            streak = 0;
        } else {
            streak = await manageStreak(diff);
        }


        const bonus = streak * STREAK_BONUS_PER_DAY;
        streak++; // increase streak for today after reward
        const Moni = Math.floor(Math.random() * (MONI_MAX - MONI_MIN + 1)) + MONI_MIN + bonus;

        // Update DB with new streak and balance
        await userDB.updateOne(
            { _id: pUser._id },
            {
                $set: {
                    dailyStreak: streak,
                    balance: pUser.balance + Moni,
                    totalNetWorth: pUser.balance + Moni,
                    lastCheckIn: new Date().toISOString()
                }
            }
        );

        // Send Daily Reward Embed
        const rewardEmbed = new EmbedBuilder()
            .setTitle("**Daily Command!**")
            .setDescription(`Please Don't Do This Daily!! 🙏\n ‎ \n **You got** ‎ ⟐ ${fMoni(Moni)} `)
            .setFooter({ text: `Your Streak: ${fMoni(streak)}` }) // Updated streak shown here

        // Create embed array with the first embed
        const embedsToSend = [rewardEmbed];

        // Missed Days Message (If Any)
        if (diff > 0) {
            const missedDays = Math.floor(diff / DAILY_COOLDOWN_MS);

            // Only show missed days if it was more than one day
            if (missedDays > 0) {
                // Use cleaner message formatting
                const missedMessage = missedDays === 1 
                    ? `You missed a day!` 
                    : `You missed ${fMoni(missedDays)} days!`;

                const missedEmbed = new EmbedBuilder()
                    .setTitle("Missed Days Report")
                    .setDescription(missedMessage)

                embedsToSend.push(missedEmbed); // Add to the array
            }
        }

        await interaction.reply({ embeds: embedsToSend });
    } catch (error) {
        console.error("⚠️ Error in /daily command:", error);
        await interaction.reply({ content: "Something went wrong, please try again later.",  flags: MessageFlags.Ephemeral, });
    }
}
