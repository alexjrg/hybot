module.exports = {
    name: 'fetch',
    description: 'Fetch les derniers articles',
    permissions: 'ADMINISTRATOR',
	execute(message) {
        const f = message.client.functions.get("fetch")
        f.execute(message.client);
	},
};