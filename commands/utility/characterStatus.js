const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("캐릭터")
    .setDescription("캐릭별 공대 상황을 보여줍니다.")
    .addStringOption((option) =>
      option
        .setName("character_name")
        .setDescription("캐릭터 이름 입력")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const characterName = interaction.options.getString("character_name");
      const url = `http://115.85.180.49:8080/api/group/member/info/${encodeURIComponent(
        characterName
      )}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to retrieve member information");
      }

      const memberInfo = await res.json();

      if (memberInfo.length === 0) {
        await interaction.reply("내용이 없습니다.");
      } else {
        // let replyMessage = "```\n";
        // replyMessage += `${characterName}의 숙제현황\n`;
        // replyMessage += "|------------------------|\n";
        // // 완료
        // replyMessage += "|           완료          |\n";
        // replyMessage += "|------------------------|\n";
        // memberInfo.forEach((status) => {
        //   if (status.done) {
        //     replyMessage += `| ${status.groupName} - ${status.raid} - ${status.difficulty} |\n`;
        //   }
        // });
        // // 미완료
        // replyMessage += "|------------------------|\n";
        // replyMessage += "|------------------------|\n";
        // replyMessage += "|          미완료         |\n";
        // replyMessage += "|------------------------|\n";
        // memberInfo.forEach((status) => {
        //   replyMessage += `| ${status.groupName} - ${status.raid} - ${status.difficulty} |\n`;
        // });
        // replyMessage += "```";
        // await interaction.reply(replyMessage);
        const completedGroups = memberInfo.filter((group) => group.done);
        const incompleteGroups = memberInfo.filter((group) => !group.done);

        const completedTable = generateTable(completedGroups);
        const incompleteTable = generateTable(incompleteGroups);

        await interaction.reply(
          `===${characterName} 현황===\n\n완료:\n${completedTable}\n미완료:\n${incompleteTable}`
        );
      }
    } catch (error) {
      await interaction.reply("Failed to retrieve member information");
    }
  },
};

function generateTable(groups) {
  const rows = groups
    .map(
      (group) => `| ${group.groupName} \n\t\t#${group.raid}-${group.difficulty}`
    )
    .join("\n");
  return rows === "" ? `\`\`\`항목 없음\`\`\`` : `\`\`\`\n${rows}\n\`\`\``;
}
