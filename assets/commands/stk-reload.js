/* eslint no-unused-vars: "off" */


module.exports = {
	name: 'reload',
	usage: '<no have parameters>',
	aliases: ['delay', 'time'],
	guildOnly: true,
	description: 'Get stalker bot response time',
	execute(message, _args, client) {

		if(!_args || _args.size < 1) return message.reply('Must provide a command name to reload.');
		const commandName = _args[0];
		// Check if the command exists and is valid
		if(!client.commands.has(commandName)) {
			return message.reply('That command does not exist');
		}
		// the path is relative to the *current folder*, so just ./filename.js
		delete require.cache[require.resolve(`./stk-${commandName}.js`)];
		// We also need to delete and reload the command from the client.commands Enmap
		client.commands.delete(commandName);
		const props = require(`./stk-${commandName}.js`);
		client.commands.set(commandName, props);
		message.reply(`The command ${commandName} has been reloaded`);

	},
};