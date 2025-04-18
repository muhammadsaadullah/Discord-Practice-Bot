const emoji = {
    blush: '<:blush:1361964494577860629>',
    blush2: '<:blush2:1361966403934224384>',
    CuteLaughSimle: '<:CuteLaughSimle:1361967204941430816>',
    Peace: '<:Peace:1361772989871427714>'
};
const meowcall = ["meow", "meowmur", "meowmurr", "meowmurrr", "meowmurrrr"];
const uwuCall = ["uwu", "uwwu"];
const catGreetings = [
    "Meow! urrMEOW!?",
    "Meow~ mrrrp nyaaa~?",
    "Mrow mrow! Prrrr~ mmmrrrp!",
    "Nya nya meow~ mrrp mrrp?",
    "Prrrrow~ mewmew nya~",
    "Meowmeow! Mrrr nya nya~",
    "Mrrrrr~ nyaaaa~ meow~?",
    "Prrrt! Meow~ mrrrnya nya!",
    "Nyaa~ mrow mrrrp purrr~",
    "Mrrrowww~ mew mew meow~",
    "Mrrrrp? Meow nyaaa~ prrrt!",
];
const UWUresponses = [
    "UwU~ Konnichiwaaaa~ 😘",
    "Oniiiii-chan, is that an uwWwu I hear? 😏",
    "UwU~ Nyaa~ Kimochhhiiiiiii~ 🌸",
    `UwU~ OniiiiiChan, you're making me blush.....${emoji.blush}`,
    "Ara arraaaa~ UwU~ Kawaii desu ne~ 😻",
    `UwU~ ${emoji.blush} Onii-chan~ 😚💖`,
    `Oho~ Is that a UUUWWWWUUUU, Onii-chan? ${emoji.blush2}`,
    "Nyaa~ UwU~ You're so cUUteE~ 😽✨",
    `UwU~ ${emoji.CuteLaughSimle} Kawaii, Onii-chan~ 😘`
];
export async function handleMeowmurrrCommand(client, message) {
    try {
        if (client.user) {
            const msg_content = message.content.toLowerCase();
            // MEOW Reply Message
            if (meowcall.some((word) => msg_content.includes(word))) {
                await message.reply('Meow Meow meeeeeeoowwwwww ');
            }
            const randomCat = catGreetings[Math.floor(Math.random() * catGreetings.length)];
            // Cat Greet
            if (message.mentions.has(client.user)) {
                await message.reply(randomCat);
            }
            // More Randoiser Function
            function shuffleArray(arr) {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
                }
            }
            shuffleArray(UWUresponses);
            const randResUWU = UWUresponses[0]; // Now pick the first after shuffle
            // UWU Reply
            if (uwuCall.some((word) => msg_content.includes(word))) {
                await message.reply(randResUWU);
            }
            // if (msg_content.includes('peace')) {
            //     message.react(emoji.Peace)
            // }
        }
    }
    catch (error) {
        console.error('Error!! :', error);
    }
}
