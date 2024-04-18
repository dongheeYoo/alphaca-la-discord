const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("공대상세")
    .setDescription("공대 세부사항을 보여줍니다.")
    .addStringOption((option) =>
      option
        .setName("group_name")
        .setDescription("캐릭터 이름 입력")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const groupName = interaction.options.getString("group_name");
      const url = `http://115.85.180.49:8080/api/group/detail/${encodeURIComponent(
        groupName
      )}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to retrieve member information");
      }

      const groupDetails = await res.json();

      if (groupDetails.length === 0) {
        await interaction.reply("내용이 없습니다.");
      } else {
        let replyMessage = "```\n";
        replyMessage += `${groupName}의 상세정보\n`;
        replyMessage += "|-------------------------------------|\n";
        groupDetails.forEach((detail) => {
          replyMessage += `레이드 - ${detail.raid} - ${detail.difficulty}\n`;
          replyMessage += `완료여부 - ${detail.done ? "완료" : "미완료"}\n`;
          replyMessage += "|---------------맴버 정보--------------|\n";
          detail.member.forEach((member) => {
            replyMessage += `${member.name} : ${member.CharacterName} - ${member.CharacterClassName} - ${member.ItemMaxLevel}\n`;
          });
        });
        replyMessage += "```";
        await interaction.reply(replyMessage);
      }
    } catch (error) {
      await interaction.reply("Failed to retrieve group information");
    }
  },
};
