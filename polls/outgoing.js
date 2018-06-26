/* exported Script */
/* globals console, _, s, HTTP */

/*
EXAMPLE MESSAGES

Your poll must start with `!poll` and the question is delimited at the first `?`, `/` or `:`
 

	!poll Can you choose? Option 1 / Option 2

	!poll Make a choice : First option / Second option

	!poll We must choose / Now / Never

*/

/** Global Helpers
 * 
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */

class Script {
	/**
	 * @params {object} request
	 */
	prepare_outgoing_request({ request }) {
		// request.params            {object}
		// request.method            {string}
		// request.url               {string}
		// request.auth              {string}
		// request.headers           {object}
		// request.data.token        {string}
		// request.data.channel_id   {string}
		// request.data.channel_name {string}
		// request.data.timestamp    {date}
		// request.data.user_id      {string}
		// request.data.user_name    {string}
		// request.data.text         {string}
		// request.data.trigger_word {string}
		
		const emojis = [
			':zero:',
			':one:',
			':two:',
			':three:',
			':four:',
			':five:',
			':six:',
			':seven:',
			':eight:',
			':nine:',
			':ten:'
		];

		let match;
		let title;
		
		let options = [];

		// Parse message
		polltext = request.data.text.replace(/^.poll\s*/, '');

		match = polltext.match(/^.+?[\?\/:]/g);
		title = match[0].replace(/\/$/, '');
		
        match = polltext.match(/(:|\?|\/)[^\/]+/g);
		
		match.forEach((item, i) => {
			item = item.replace(/^(\/|\?)/g, '- ');
			options.push(emojis[(options.length + 1)] + ' ' + item);
		});

		return {
				message: {
					text: '_Please vote using reaction emojis (top right of this poll message)_',
					attachments: [
						{
							color: '#0000DD',
							title: title,
							text: options.join('\n')
						}
					]
				}
			};
	}

	/**
	 * @params {object} request, response
	 */
	process_outgoing_response({ request, response }) {
	}
}
