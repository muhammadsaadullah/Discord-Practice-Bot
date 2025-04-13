import { Message, Client } from "discord.js";

export async function handleMahadCommand(client: Client, message:Message) {
    try {
        if (client.user) {
            if (message.author.id === '760908279454236712') {
                // Check if the bot is mentioned in the message
                if (message.mentions.has(client.user)) {
                    message.reply(`I Will TOUCH Yu 2Knight, Ma Nigga..... KAKAROT U R GAE`);
                }
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }      
}
