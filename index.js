const fs = require('fs');
const { prefix, token } = require('./config.json');
const { version } = require('./package.json');

process.on("unhandledRejection", (reason) => {
    console.error(reason);
    process.exit(1);
  });

let Discord;
try {
    Discord = require("discord.js");
}catch(e){
    console.log(e.stack);
    console.log(process.version);
    console.log("Please run npm install and ensure all dependencies are installed, it should pass with no errors!");
    process.exit();
}

console.log(
    "Starting HyBot v" + version +
    "\nNode version: " +
    process.version +
    "\nDiscord.js version: " +
    Discord.version
);

const bot = new Discord.Client();

//Commands
bot.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		bot.commands.set(command.name, command);
	}
}

//Functions
bot.functions = new Discord.Collection();
const functionFiles = fs.readdirSync(`./functions`).filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	bot.functions.set(func.name, func);
}

bot.on("ready", function () {
    console.log(
        "Bot ready ! Currently deployed on " + bot.guilds.cache.array().length + " server(s)." 
    );
    bot.user.setPresence({
        status: "online",
        activity: {
          name: "Hytale News",
          type: "WATCHING",
        },
      });
    const f = bot.functions.get("fetch");
    f.execute(bot);
});

bot.on("disconnected", function () {
    console.log("Bot disconnected!");
    process.exit(1);
  });

//Message
bot.on('message', message => {
    //Il faut que le message commence par le préfixe et que le bot n'en soit pas l'auteur
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type == 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!bot.commands.has(commandName)) return;

    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.args && !args.length) {
        let reply = `Oups je crois qu'il manque quelque chose, ${message.author}!`;

		if (command.usage) {
			reply += `\nEssayes plutôt comme ceci: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
    }

    //Permission check
    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply(`tu ne possèdes pas la permission de faire ça !`);
        }
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('une erreur est survenue !');
    }
});


bot.login(token);