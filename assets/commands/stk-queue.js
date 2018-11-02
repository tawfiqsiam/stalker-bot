/* eslint no-unused-vars: "off" */

const Discord = require('discord.js');


module.exports = {
	name: 'queue',
	usage: '<tab number | empty for first tab>',
	aliases: ['q', 'list'],
	guildOnly: true,
	description: 'Shows current songs queue for stalker bot',
	async execute(message, _args, _client, options) {
		let Songs = options.songQ.get(message.guild.id);
		let currentQueue = (Songs !== undefined && Songs !== null) ? Songs.Queue : null;
		let tabSelection = (_args[0] == undefined || _args == null) ? 1 : _args[0];
		if(currentQueue !== null) {
			let queueChunked = chunk(currentQueue, 10);
			console.log(`Searched tab: ${_args[0]} selected tab: ${tabSelection}`);
			if (tabSelection != 0) {
				if(tabSelection <= queueChunked.length) {
					let msg = await message.channel.send('`Searching Queue list`');
					let queueEmbed = new Discord.RichEmbed()
						.setAuthor('Stalker Music', 'https://i.imgur.com/Xr28Jxy.png')
						.setColor('#7f1515');
					const elements = queueChunked[tabSelection - 1];
					for (let indexElemnts = 0; indexElemnts < elements.length; indexElemnts++) {
						const song = elements[indexElemnts];
						console.log(`${indexElemnts}`);
						queueEmbed.setTitle('Current Queue');
						if(indexElemnts == 0) {
							queueEmbed.addField('**Now Playing**', `** [${song.songName}](${song.url}) | Requested by: <@${song.requestby}>  **`, false)
								.addBlankField(true)
								.addField('** :arrow_down: == Up Next == :arrow_down:**', `${elements.length} Songs`, false);
						}
						else {
							queueEmbed.addField(`${indexElemnts}.`, `** [${song.songName}](${song.url}) | Requested by: <@${song.requestby}> **`, true)
								.setTimestamp()
								.setFooter(`Tab ${tabSelection} / ${queueChunked.length} Powered by Stalker Music`, 'https://i.imgur.com/Xr28Jxy.png');
						}
						msg.edit(queueEmbed);
					}
				}
				else{
					message.channel.send('**This tab number doesn\'t exist :x:**');
				}
			}
			else{
				message.channel.send('**You can search for tab 0 :x:**');
			}
		}
		else{
			message.channel.send('**Nothing is playing at this time, please use play (song) to play a song :x:**');
		}

		function chunk(array, size) {
			const chunked_arr = [];
			let index = 0;
			while (index < array.length) {
				chunked_arr.push(array.slice(index, size + index));
				index += size;
			}
			return chunked_arr;
		}
	},
};