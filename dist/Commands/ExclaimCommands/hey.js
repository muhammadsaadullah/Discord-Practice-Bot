import { userMention } from "discord.js";
export async function handleHeyCommand(message) {
    try {
        if (message.content === "!hey" && !message.author.bot) {
            console.log(message.content);
            message.reply(`Hey ${userMention(message.author.id)}! Welcome to The Practise Bot :P`);
            console.log("Message sent successfully!");
        }
        if ((message.content == "Thanks" || message.content === "Thank You") && !message.author.bot) {
            message.react("❤️");
            message.reply("You're welcome!");
            return 0;
        }
    }
    catch (error) {
        console.error("Error handling !hey command:", error);
    }
}
