var Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: 'fetch',
	async execute(bot) {
		var chan = bot.channels.cache.get('819304382532157551');
		if(chan){
			await fetch('https://hytale.com/api/blog/post/published')
					.then(response => response.json())
					.then(json => {
						console.log(json)
						json.forEach(article => {
							var publishedAt = new Date(article['publishedAt'])

							const embed = new Discord.MessageEmbed()
							.setColor(0xfcbb02)
							.setTitle(article['title'])
							.setThumbnail("https://hytale.com/static/images/logo.png")
							.setAuthor(article['author'], "https://hytale.com/static/images/logo-h.png","https://hytale.com")
							.setFooter("I'm not affiliated with Hytale or Hypixel Studio.")
							.setURL(`https://hytale.com/news/${publishedAt.getFullYear()}/${publishedAt.getMonth()+1}/${article['slug']}`)
							.setDescription(article['bodyExcerpt'])
							.setImage(`https://cdn.hytale.com/${article['coverImage']['s3Key']}`)
							.setTimestamp(publishedAt.toLocaleDateString())

							chan.send(embed)
						});
						
					});

					
			
			//
			
		}
	},
}; 