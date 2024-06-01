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

  const createEmbed = (color, description) =>
    new EmbedBuilder().setColor(color).setDescription(description);
};
