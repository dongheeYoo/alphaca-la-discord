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
        const completedGroups = groups.filter((group) => group.done);
        const incompleteGroups = groups.filter((group) => !group.done);

        const completedTable = generateTable(completedGroups);
        const incompleteTable = generateTable(incompleteGroups);

        await interaction.reply(
          `===공대현황===\n\n완료:\n${completedTable}\n미완료:\n${incompleteTable}`
        );
      }
    } catch (error) {
      await interaction.reply("Failed to load groups");
    }
  },
};

function generateTable(groups) {
  const rows = groups
    .map((group) => `| ${group.name} \n\t\t#${group.raid}-${group.difficulty}`)
    .join("\n");
  return rows === "" ? `\`\`\`항목 없음\`\`\`` : `\`\`\`\n${rows}\n\`\`\``;
}
