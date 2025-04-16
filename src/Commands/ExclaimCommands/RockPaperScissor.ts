import { Message, userMention, TextChannel } from "discord.js";


// Rock Paper Scissors Game 
const gameState = new Map<string, boolean>()

export async function handleRPSCommand(message: Message) {
    if (message.author.bot) return;

    try {
        if (message.content === "!play") {
            message.reply(`Okay ${userMention(message.author.id)}, Lets Play Rock Paper Sciccors. Its the Only Game I have Currently :)`)
            // Check if the channel is a TextChannel before sending a message
            if (message.channel instanceof TextChannel) {
                message.channel.send(`Press One: Either R for Rock, P for Paper, OR S for Sciccors`);
            } else {
                console.error("Message is not sent in a TextChannel.");
            }
            
            gameState.set(message.author.id, true)
            return
        }
        
        if (gameState.get(message.author.id)) {
            if (message.content === "R"){
                // message.reply("HAHA Nigger Yu LOST!!")
                message.reply("HAHA Yu LOST!!")
                gameState.set(message.author.id, false)
            } else if (message.content === "S") {
                message.reply("Thats What Gurls do. POOKIE")
                gameState.set(message.author.id, false)
            } else if (message.content === "P"){
                // message.reply("WOW You WON Mother FUCKER")
                message.reply("WOW You WON Mother")
                gameState.set(message.author.id, false)
            } else if (message.content != "S" && message.content != "R" && message.content != "P" ) {
                message.reply("HEY YU, Smart Alec... ENTER A VALID OPTION")
            } 
        }   
    } catch (error) {
        console.error('Error handling message:', error)
    }    
}

