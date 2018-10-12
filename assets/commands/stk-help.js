const { prefix } = require('../config/botcfg');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(_message, _args) {
		const data = [];
		const { commands } = _message.client;

		if (!_args.length) {
			/**
             * Append some strings, .map() over the commands Collection,
             * and add an additional string to let the user know how to trigger information
             * about a specific command.
             *
             * Since help messages can get messy, you'll be DMing it to the message author instead of posting it
             * in the requested channel.
             * Catch if the User has DM blocked
             */
			data.push('Here\'s a list of all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return _message.author.send(data, { split: true })
				.then(() => {
					if (_message.channel.type === 'dm') return;
					_message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${_message.author.tag}.\n`, error);
					_message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		}

		// Setup Help Structure Response

		const name = _args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return _message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		_message.channel.send(data, { split: true });
	},
};