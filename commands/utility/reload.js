const fs = require('fs');

module.exports = {
    name: 'reload',
    aliases: 'rl',
    description: 'Reload une commande',
    args: true,
    permissions: 'ADMINISTRATOR',
	execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`La commande \`${commandName}\` n'existe pas !`);

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`La commande \`${command.name}\` a été reload!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`Une erreur est survenue en essayant de reload la commande \`${command.name}\`:\n\`${error.message}\``);
        }
	},
};