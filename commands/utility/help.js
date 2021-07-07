const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	description: 'Liste toutes les commandes disponibles ou les infos a propos d\'une commande spécifique.',
	aliases: ['commands'],
    usage: '[command name]',
    args: false,
    cooldown: 5,
	execute(message, args) {
		const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('\nVoici mes commandes:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nTu peux faire \`${prefix}help [command name]\` pour avoir des infos sur une commande spécifique !`);

            return message.channel.send(data, { split: true });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send('Ce n\'est pas une commande valide !');
        }

        data.push(`\n**Nom:** ${command.name}`);

        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

        message.channel.send(data, { split: true });
    },
};