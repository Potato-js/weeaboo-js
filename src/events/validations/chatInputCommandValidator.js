const { EmbedBuilder } = require("discord.js");
const { developersID, serverID } = require("../../config.json");
const mConfig = require("../../messageConfig.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand) return;

  const localComamnds = getLocalCommands();
  const commandObject = localComamnds.find(
    (cmd) => cmd.data.name === interaction.commandName
  );

  if (!commandObject) return;

  const createEmbed = (color, description, footer) =>
    new EmbedBuilder()
      .setColor(color)
      .setDescription(description)
      .setFooter(footer);

  if (commandObject.devOnly && !developersID.includes(interaction.user.id)) {
    const rEmbed = createEmbed(
      mConfig.embedColorError,
      mConfig.commandDevOnly,
      mConfig.copyrightString
    );
    return interaction.reply({ embeds: [rEmbed], ephemeral: true });
  }

  if (commandObject.testMode && interaction.guild.id !== serverID) {
    const rEmbed = createEmbed(
      mConfig.embedColorError,
      mConfig.commandTestMode,
      mConfig.copyrightString
    );
    return interaction.reply({ embeds: [rEmbed], ephemeral: true });
  }

  for (const permission of commandObject.userPermissions || []) {
    if (!interaction.member.permissions.has(permission)) {
      const rEmbed = createEmbed(
        mConfig.embedColorError,
        mConfig.userNoPermissions,
        mConfig.copyrightString
      );
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }
  }

  const bot = interaction.guild.members.me;
  for (const permission of commandObject.botPermissions || []) {
    if (!bot.permissions.has(permission)) {
      const rEmbed = createEmbed(
        mConfig.embedColorError,
        mConfig.botNoPermissions,
        mConfig.copyrightString
      );
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }

    try {
      await commandObject.run(client, interaction);
    } catch (error) {
      console.log(
        `[CRIT] An error occured in the command registery: ${error}`.red
      );
    }
  }
};
