import { EmbedBuilder } from "discord.js";
export async function handleHelpCommand(options) {
    const { interaction, message, client } = options;
    try {
        const avatarUrl = client.user?.avatarURL() ?? '';
        const embed = new EmbedBuilder()
            .setTitle("📘 Meowmurrr Help Menu")
            .setURL("https://example.com")
            //               description                                                                                                                                  slash command heading                     : commands                                                                                                                                                                                                   prefix commands headings                   : commands start                                                                                                                                                                                  Announcement:                                                                                                                                                                                
            .setDescription("Here’s a comprehensive guide to using Meowmurrr's commands! Explore the different categories below to learn how to interact with the bot.\n### **__ Slash Commands (Use with __`/`__)__**\n`/wallet`**:**  Check how much MeowKoin ( **[⟐](https://meowkoin.com)** )  you have.\n`/daily`**:**  Here’s your daily 'a'... Open your mouth — say, 'aaaaaaaa'\n`/ping`**:**  Don't you dare to ping...else\n`/help`**:** I hear you wlep, I’m here for help!! but if it’s 'a' then go **FUCK** yourself.\n### **__ Prefix Commands (Use with __`!`__)__**\n`!hey`**:** Hey dawg, yo, wassup? 😎.\n`!play`**:** I'll Play with Yu.. I mean Rock, Paper, Scissors.🪨 📄 ✂️\n`!wallet`**:** Check How *MUCH*  You Worth!!!.\n`!help`**:** Yes, you guessed it right... Welp also works with !.\n\n\n > 📢 **Big Update Coming Soon!**\n> Get ready for an *amazing* new UI and tons of exciting features, dropping on **[25th May 2025](https://tinyurl.com/meormurrr)**! Mark your calendars — you won't want to miss this! Stay tuned for a whole new Meowmurrr experience! \n> **Get ready for something** **[BIG](https://imgur.com/a/OeKUole)!** 🚀 \n\n ------------------------------------------------------------------------------------- ")
            .addFields({
            name: "__✨ More Than Just Commands__",
            value: "Meowmurrr isn’t just a bot—it’s a whole mood. With fresh features, custom emojis, and new ways to earn MeowKoin on the way, now’s the time to get cozy. Say ||meow||, tag <@1359620788650770532>, or just vibe with the community. You know you want to.",
            inline: false
        }, {
            name: "__Stay Updated & Get Support__",
            // value: "```\nJoin our server for updates — tons of new features coming!\nNeed help? Drop your questions in the support channels.\n```",
            value: "```\nJoin our awesome community server for updates & exciting news — tons of new features are coming your way soon!\nNeed help? Drop your questions in the support channels.\n```",
            inline: false
        })
            // .setImage('https://imgur.com/a/LZuXSya')
            .setColor(0x5D4E8B)
            .setFooter({
            text: "Meowmurrr ⚡",
            iconURL: avatarUrl,
        })
            .setTimestamp();
        if (message && (message.content.toLowerCase() === '!help')) {
            await message.reply({ embeds: [embed] });
        }
        else if (interaction) {
            await interaction.reply({ embeds: [embed] });
        }
    }
    catch (error) {
        console.error("Error in help command:", error);
    }
}
