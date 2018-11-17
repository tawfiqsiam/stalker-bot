/* eslint no-unused-vars: "off" */
const Discord = require('discord.js');

module.exports = {
	name: 'reload',
	category: 'dev-only',
	usage: '<no have parameters>',
	aliases: ['delay', 'time'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args, client) {

		let NotDev = new Discord.RichEmbed()
			.setColor('GREEN')
			.setTitle('Evaluation')
			.setDescription('Sorry, the `eval` command can only be executed by the Developer.')
			.setTimestamp();

		if (!['216403723818106880', '183790855813988353'].includes(message.author.id)) return message.channel.send(NotDev);
		if (!_args || _args.size < 1) return message.reply('Must provide a command name to reload.');
		const commandName = _args[0];
		// Check if the command exists and is valid
		if (!client.commands.has(commandName)) {
			return message.reply('That command does not exist');
		}
		// the path is relative to the *current folder*, so just ./filename.js
		delete require.cache[require.resolve(`./stk-${commandName}.js`)];
		// We also need to delete and reload the command from the client.commands Enmap
		client.commands.delete(commandName);
		const props = require(`./stk-${commandName}.js`);
		client.commands.set(commandName, props);
		message.reply(`**The command \`${commandName}\` has been reloaded** :arrows_counterclockwise:`);

	},
};
