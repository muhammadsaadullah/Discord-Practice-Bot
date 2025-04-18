import { Message, userMention } from "discord.js";

export async function handleHeyCommand(message: Message) {
    try{
        if (message.content.toLowerCase() === "!hey" && !message.author.bot) {
            message.reply(`Hey ${userMention(message.author.id)}! Welcome to Meowmurrr 🐾 :P`)
        }
        
        const list = ["thanks", "thank you", "thx", "thnx", "thanx"]
        const msg_content = message.content

        if ((list.some((word) => msg_content.includes(word))) && !message.author.bot) {
            message.react("❤️");
            message.reply("You're welcome!")
            return 0
        }    
    } catch (error) {
        console.error("Error handling !hey command:", error);
    }
}
