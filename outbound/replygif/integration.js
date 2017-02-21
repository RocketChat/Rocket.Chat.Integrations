class Script {
	prepare_outgoing_request({ request }) {
		const trigger = request.data.trigger_word.toLowerCase() + ' ';
		const phrase = request.data.text.toLowerCase().replace(trigger, '').replace(/\s+/g, ',');
		const u = request.url + '/gifs?api-key=39YAprx5Yi&tag-operator=and&tag=' + phrase;

		return {
			url: u,
			headers: request.headers,
			method: 'GET'
		};
	}

	process_outgoing_response({ response }) {
		let gif = '';

		if (response.content.length !== 0) {
			if (Array.isArray(response.content)) {
				const count = response.content.length - 1;
				const i = Math.floor((Math.random() * count));
				gif = response.content[i].file;
			} else {
				gif = response.content.file;
			}

			return {
				content: {
					attachments: [
						{
							title: 'ReplyGif',
							image_url: gif
						}
					]
				}
			};
		} else {
			return {
				content: {
					text: ':grimacing: Well, that\'s embarrasing. We failed to come up with a reply. Maybe you should try a different phrase.'
				}
			};
		}
	}
}
