const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("명령어")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    let replyMessage = "```\n";
    replyMessage += "/공대 : 공격대 현황\n";
    replyMessage += "/캐릭터 '캐릭터명' : 캐릭터 현황\n";
    replyMessage += "/공대상세 '공대명' : 공대 상세\n";
    replyMessage += "```";
    await interaction.reply(replyMessage);
  },
};
