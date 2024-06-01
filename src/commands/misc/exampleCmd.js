const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command if everything works!")
    .setDMPermission(false)
    .addSubcommandGroup((subscommandgroup) =>
      subscommandgroup
        .setName("user")
        .setDescription("Configure a user.")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("role")
            .setDescription("Configure a user's role.")
            .addUserOption((option) =>
              option.setName("user").setDescription("The user to configure")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("nickname")
            .setDescription("Configure a user's nickname.")
            .addStringOption((option) =>
              option
                .setName("nickname")
                .setDescription("The nickname the user will have")
            )
            .addUserOption((option) =>
              option.setName("user").setDescription("The user to configure")
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("message").setDescription("Configure a message.")
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.Connect],

  run: (client, interaction) => {
    return interaction.reply("This command is a test command!");
  },
};
