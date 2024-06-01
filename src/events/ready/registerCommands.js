require("colors");

const { serverID } = require("../../config.json");
const commandComparing = require("../../utils/commandComparing");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  try {
    const [localCommands, applicationCommands] = await Promise.all([
      getLocalCommands(),
      getApplicationCommands(client, serverID),
    ]);

    for (const localCommand of localCommands) {
      const { data, deleted } = localCommand;
      const {
        name: commandName,
        description: commandDescription,
        options: commandOptions,
      } = data;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === commandName
      );

      if (deleted) {
        if (existingCommand) {
          await applicationCommands.delete(existingCommand.id);
          console.log(
            `[WARN] Application command ${commandName} has been deleted or cannot be found.`
              .yellow
          );
        } else {
          console.log(
            `[WARN] Application command ${commandName} has been skipped, since property "deleted" is set to "true"`
              .yellow
          );
        }
      } else if (existingCommand) {
        if (commandComparing(existingCommand, commandOptions)) {
          await applicationCommands.edit(existingCommand.id, {
            name: commandName,
            description: commandDescription,
            options: commandOptions,
          });
          console.log(
            `[WARN] Application command ${commandName} has been editied.`.yellow
          );
        }
      } else {
        await applicationCommands.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions,
        });
        console.log(
          `[INFO] Application command ${commandName} has been editied.`.gray
        );
      }
    }
  } catch (error) {
    console.log(
      `[CRIT] An error occured in the command registery: ${error}`.red
    );
  }
};
