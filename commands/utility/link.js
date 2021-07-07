module.exports = {
    name: 'link',
    description: 'Link un channel pour le bot',
    permissions: 'ADMINISTRATOR',
	execute(message) {
        message.client.chanId = message.channel.id
        message.channel.send("Ce channel est maintenant lié");
	},
};