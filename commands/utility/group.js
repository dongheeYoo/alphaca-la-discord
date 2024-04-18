const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("공대")
    .setDescription("Replies with members"),
  async execute(interaction) {
    try {
      const res = await fetch("http://115.85.180.49:8080/api/group");
      if (!res.ok) {
        throw new Error("Failed to retrieve groups");
      }
      const groups = await res.json();
      if (groups.length === 0) {
        await interaction.reply("No groups found");
      } else {
        let replyMessage = "```\n";
        replyMessage += "|        공격대 현황      |\n";
        replyMessage += "|------------------------|\n";
        // 그룹 이름 추가
        // 완료
        replyMessage += "|           완료          |\n";
        replyMessage += "|------------------------|\n";
        groups.forEach((group) => {
          if (group.done) {
            replyMessage += `| ${group.name} - ${group.raid} - ${group.difficulty} |\n`;
          }
        });
        // 미완료
        replyMessage += "|------------------------|\n";
        replyMessage += "|------------------------|\n";
        replyMessage += "|          미완료         |\n";
        replyMessage += "|------------------------|\n";
        groups.forEach((group) => {
          if (!group.done) {
            replyMessage += `| ${group.name} - ${group.raid} - ${group.difficulty} |\n`;
          }
        });
        replyMessage += "```";
        await interaction.reply(replyMessage);
      }
    } catch (error) {
      await interaction.reply("Failed to load groups");
    }
  },
};
