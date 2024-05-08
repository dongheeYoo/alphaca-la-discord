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
        let replyMessage = `${groupName} 상세`;
        replyMessage += "```\n";
        groupDetails.forEach((detail) => {
          replyMessage += `#${detail.raid}\n#${detail.difficulty}\n`;
          replyMessage += `#${detail.done ? "완료" : "미완료"}\n`;
          replyMessage += "```\n";
          replyMessage += "멤버\n";
          replyMessage += "```\n";
          detail.member.forEach((member) => {
            let name = "";
            switch (member.name) {
              case "히도뉴":
                name = "동희";
                break;
              case "RAFF":
                name = "라프";
                break;
              case "알망고얌":
                name = "망고";
                break;
              case "아키나츠리":
                name = "토모";
                break;
              case "수라로로":
                name = "동재";
                break;
              default:
                break;
            }
            replyMessage += `| ${name}\n`;
            replyMessage += `\t#${member.CharacterName}\n\t#${member.CharacterClassName}\n`;
          });
        });
        replyMessage += "```";
        await interaction.reply(replyMessage);
      }
    } catch (error) {
      await interaction.reply("Failed to retrieve group detail information");
    }
  },
};
